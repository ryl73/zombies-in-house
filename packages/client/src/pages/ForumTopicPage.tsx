import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams, Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Header } from '../components/Header'
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Avatar,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowBack } from '@material-ui/icons'
import {
  CommentList,
  Comment,
  mockComments,
} from '../components/Forum/CommentList'
import { CommentForm } from '../components/Forum/CommentForm'
import { mockTopics, Topic } from '../components/Forum/TopicItem'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
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
    alignItems: 'center',
    marginBottom: theme.spacing(2),
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

  const [topic, setTopic] = useState<Topic>()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // Делаю имитацию загрузки данных
      await new Promise(resolve => setTimeout(resolve, 500))

      const topicId = parseInt(id || '', 10)
      const foundTopic = mockTopics.find(t => t.id === topicId)

      if (foundTopic) {
        setTopic(foundTopic)
        setComments(mockComments[topicId] || [])
      }

      setIsLoading(false)
    }

    loadData()
  }, [id])

  const handleAddComment = async (content: string) => {
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const newComment: Comment = {
        id: Date.now(),
        author: 'new_user_999',
        content,
        createdAt: new Date(),
      }

      setComments(prev => [...prev, newComment])

      if (topic) {
        setTopic({
          ...topic,
          commentsCount: topic.commentsCount + 1,
        })
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
        <Container maxWidth="lg" style={{ paddingTop: '2rem' }}>
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
        <Container maxWidth="lg" style={{ paddingTop: '2rem' }}>
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

          <Typography variant="body1" align="center" style={{ marginTop: 16 }}>
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
        <meta name="description" content={topic.content.substring(0, 150)} />
      </Helmet>

      <Header />

      <Container
        maxWidth="lg"
        style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
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
            <Typography variant="h4" component="h1">
              {topic.title}
            </Typography>
          </Box>

          <Typography
            variant="body1"
            paragraph
            style={{ whiteSpace: 'pre-line' }}>
            {topic.content}
          </Typography>

          <Box className={classes.metaInfo}>
            <Box display="flex" alignItems="center">
              <Avatar className={classes.avatar}>
                {topic.author.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="caption" color="textSecondary">
                {topic.author}
              </Typography>
            </Box>
            <Typography variant="caption" color="textSecondary">
              {topic.createdAt.toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>

        <CommentList comments={comments} />

        <CommentForm onSubmit={handleAddComment} isSubmitting={isSubmitting} />
        {submitError && (
          <Typography color="error" variant="body2" style={{ marginTop: 16 }}>
            {submitError}
          </Typography>
        )}
      </Container>
    </Box>
  )
}

export const initForumTopicPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
