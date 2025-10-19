import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Header } from '../components/Header/Header'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Avatar,
  CircularProgress,
  IconButton,
} from '@material-ui/core'
import { TopicMenu } from '../components/Forum/TopicMenu'
import { EditTopicDialog } from '../components/Forum/EditTopicDialog'
import { DeleteTopicDialog } from '../components/Forum/DeleteTopicDialog'
import { MoreVert } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowBack } from '@material-ui/icons'
import { CommentList } from '../components/Forum/CommentList'
import { CommentForm } from '../components/Forum/CommentForm'
import { Comment, Topic } from '../types/forum'
import { useAppSelector } from '../hooks/useApp'
import { selectUser } from '../slices/userSlice'
import { forumAPI } from '../api/forumAPI'
import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
  },
  container: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
  loadingContainer: {
    paddingTop: '2rem',
  },
  noTopicContainer: {
    paddingTop: '2rem',
  },
  noTopicDescription: {
    marginTop: theme.spacing(2),
  },
  errorText: {
    marginTop: theme.spacing(2),
  },
  topicContent: {
    whiteSpace: 'pre-line',
  },
  backButton: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(3),
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  title: {
    color: theme.palette.text.primary,
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    backgroundColor: theme.palette.primary.light,
    marginRight: theme.spacing(1),
  },
  metaInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px',
  },
}))

export const ForumTopicPage = () => {
  usePage({ initPage: initForumTopicPage })
  const classes = useStyles()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [topic, setTopic] = useState<Topic>()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const currentUser = useAppSelector(selectUser)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const isTopicAuthor = currentUser?.login === topic?.authorLogin

  const handleOpenEditDialog = () => {
    if (topic) {
      setEditTitle(topic.title)
      setEditDescription(topic.description)
    }
    setEditDialogOpen(true)
    setMenuAnchor(null)
  }

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true)
    setMenuAnchor(null)
  }

  const handleEditTopic = async () => {
    if (!topic) return

    setIsEditing(true)
    try {
      const response = await forumAPI.updateTopic(topic.id, {
        title: editTitle,
        description: editDescription,
      })

      if (response.success && response.data) {
        setTopic(response.data)
        setEditDialogOpen(false)
      } else {
        setSubmitError(response.message || 'Ошибка обновления топика')
      }
    } catch (error) {
      console.error('Ошибка при редактировании топика:', error)
      setSubmitError('Не удалось обновить топик')
    } finally {
      setIsEditing(false)
    }
  }

  const handleDeleteTopic = async () => {
    if (!topic) return

    setIsDeleting(true)
    try {
      const response = await forumAPI.deleteTopic(topic.id)

      if (response.success) {
        navigate('/forum')
      } else {
        setSubmitError(response.message || 'Ошибка удаления топика')
      }
    } catch (error) {
      console.error('Ошибка при удалении топика:', error)
      setSubmitError('Не удалось удалить топик')
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }
  const handleCommentUpdate = (commentId: string, newMessage: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? { ...comment, message: newMessage } : comment
      )
    )
  }

  const handleCommentDelete = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId))
    setTopic(prev =>
      prev ? { ...prev, commentsCount: (prev.commentsCount || 1) - 1 } : prev
    )
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)

      if (!id) {
        setIsLoading(false)
        return
      }

      try {
        const [topicResponse, commentsResponse] = await Promise.all([
          forumAPI.getTopic(id),
          forumAPI.getComments(id),
        ])

        if (topicResponse.success && topicResponse.data) {
          setTopic(topicResponse.data)
        } else {
          console.error('Топик не найден')
        }

        if (commentsResponse.success && commentsResponse.data) {
          setComments(commentsResponse.data.data)
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id, navigate])

  const handleAddComment = async (content: string) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      if (topic) {
        const response = await forumAPI.createComment({
          topicId: topic.id,
          message: content,
        })

        if (response.success && response.data) {
          const commentsResponse = await forumAPI.getComments(topic.id)
          if (commentsResponse.success && commentsResponse.data) {
            setComments(commentsResponse.data.data)
          }

          setTopic(prev =>
            prev
              ? {
                  ...prev,
                  commentsCount: (prev.commentsCount || 0) + 1,
                }
              : prev
          )
        } else {
          setSubmitError(response.message || 'Не удалось добавить комментарий')
        }
      }
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error)
      setSubmitError('Не удалось добавить комментарий. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Box className={classes.root}>
        <Header />
        <Container maxWidth="lg" className={classes.loadingContainer}>
          <Box className={classes.loading}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    )
  }

  if (!topic) {
    return (
      <Box className={classes.root}>
        <Header />
        <Container maxWidth="lg" className={classes.noTopicContainer}>
          <Button
            component={Link}
            to="/forum"
            startIcon={<ArrowBack />}
            className={classes.backButton}
            color="primary">
            Назад к форуму
          </Button>

          <Typography variant="h4" component="h1" align="center">
            Топик не найден
          </Typography>

          <Typography
            variant="body1"
            align="center"
            className={classes.noTopicDescription}>
            Запрошенный топик не существует или был удален.
          </Typography>
        </Container>
      </Box>
    )
  }

  return (
    <Box className={classes.root}>
      <Helmet>
        <title>{topic.title} | Форум | Зомби в доме</title>
        <meta
          name="description"
          content={
            topic.description
              ? topic.description.slice(0, 150)
              : 'Описание отсутствует'
          }
        />
      </Helmet>

      <Header />

      <Container maxWidth="lg" className={classes.container}>
        <Button
          component={Link}
          to="/forum"
          startIcon={<ArrowBack />}
          className={classes.backButton}
          color="primary">
          Назад к форуму
        </Button>

        <Paper className={classes.paper} elevation={3}>
          <Box className={classes.header}>
            <Typography variant="h4" component="h1" className={classes.title}>
              {topic.title}
            </Typography>

            {isTopicAuthor && (
              <>
                <IconButton
                  onClick={e => setMenuAnchor(e.currentTarget)}
                  aria-label="Действия с топиком">
                  <MoreVert color="secondary" />
                </IconButton>

                <TopicMenu
                  anchorEl={menuAnchor}
                  onClose={() => setMenuAnchor(null)}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                />
              </>
            )}
          </Box>

          <Typography
            variant="body1"
            paragraph
            className={classes.topicContent}>
            {topic.description}
          </Typography>

          <Box className={classes.metaInfo}>
            <Box display="flex" alignItems="center">
              <Avatar
                className={classes.avatar}
                src={`https://ya-praktikum.tech/api/v2/resources${topic.authorAvatar}`}>
                {topic.authorLogin?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="textSecondary">
                {topic.authorLogin}
              </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary">
              {new Date(topic.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>

        <CommentList
          comments={comments}
          onCommentUpdate={handleCommentUpdate}
          onCommentDelete={handleCommentDelete}
        />

        <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
        {submitError && (
          <Typography
            color="error"
            variant="body2"
            className={classes.errorText}>
            {submitError}
          </Typography>
        )}

        <EditTopicDialog
          open={editDialogOpen}
          title={editTitle}
          description={editDescription}
          isEditing={isEditing}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleEditTopic}
          onTitleChange={setEditTitle}
          onDescriptionChange={setEditDescription}
        />

        <DeleteTopicDialog
          open={deleteDialogOpen}
          topicTitle={topic?.title || ''}
          isDeleting={isDeleting}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteTopic}
        />
      </Container>
    </Box>
  )
}

export const initForumTopicPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
