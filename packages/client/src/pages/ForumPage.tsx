import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Header } from '../components/Header/Header'
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { TopicItem } from '../components/Forum/TopicItem'
import { ForumPagination } from '../components/Forum/ForumPagination'
import { Topic, PaginatedResponse } from '../types/forum'
import { forumAPI } from '../api/forumAPI'

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
  },
  container: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    flexWrap: 'wrap',
    gap: theme.spacing(2),
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8, 2),
  },
  createTopicBtn: {
    whiteSpace: 'nowrap',
    minWidth: '175px',
  },
  topicsList: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}))

export const ForumPage = () => {
  usePage({ initPage: initForumPage })
  const classes = useStyles()
  const [topicsData, setTopicsData] = useState<PaginatedResponse<
    Topic[]
  > | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [commentsCount, setCommentsCount] = useState<Record<string, number>>({})

  const topics = topicsData?.data || []
  const pagination = topicsData?.pagination

  const loadTopics = async (page = 1, limit = pageSize) => {
    try {
      setIsLoading(true)
      const response = await forumAPI.getTopics({ page, limit })
      console.log('Topics API response:', response)

      if (response.success && response.data) {
        setTopicsData(response.data)
        loadCommentsCount(response.data.data)
      } else {
        setTopicsData(null)
      }
    } catch (error) {
      console.error('Ошибка загрузки топиков:', error)
      setTopicsData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const loadCommentsCount = async (topicsList: Topic[]) => {
    const counts: Record<string, number> = {}

    const promises = topicsList.map(async topic => {
      try {
        const response = await forumAPI.getComments(topic.id, {
          page: 1,
          limit: 1,
        })
        if (response.success && response.data) {
          counts[topic.id] = response.data.pagination.total
        }
      } catch (error) {
        console.error(
          `Ошибка загрузки комментариев для топика ${topic.id}:`,
          error
        )
        counts[topic.id] = 0
      }
    })

    await Promise.all(promises)
    setCommentsCount(prev => ({ ...prev, ...counts }))
  }

  useEffect(() => {
    loadTopics(1, pageSize)
  }, [pageSize])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    loadTopics(page, pageSize)
  }

  if (isLoading) {
    return (
      <Box className={classes.wrapper}>
        <Header />
        <Container maxWidth="lg" className={classes.container}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px">
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Box className={classes.wrapper}>
      <Helmet>
        <title>Форум | Зомби в доме</title>
        <meta
          name="description"
          content="Обсуждение стратегий и советов по игре Зомби в доме"
        />
      </Helmet>

      <Header />

      <Container maxWidth="lg" className={classes.container}>
        <Box className={classes.header}>
          <Typography variant="h2" component="h1">
            Форум
          </Typography>
          <Button
            component={Link}
            to="/forum/create"
            variant="contained"
            color="primary"
            className={classes.createTopicBtn}>
            Создать топик
          </Button>
        </Box>

        {topics.length === 0 ? (
          <Box className={classes.emptyState}>
            <Typography variant="h5" color="textPrimary" gutterBottom>
              Пока нет топиков
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Будьте первым, кто создаст топик для обсуждения!
            </Typography>
            <Button
              component={Link}
              to="/forum/create"
              variant="contained"
              color="primary"
              size="large">
              Создать первый топик
            </Button>
          </Box>
        ) : (
          <Box>
            <Box className={classes.topicsList}>
              {topics.map(topic => (
                <TopicItem
                  key={topic.id}
                  topic={topic}
                  isContent={false}
                  commentsCount={commentsCount[topic.id]}
                />
              ))}
            </Box>

            {pagination && pagination.pageCount > 1 && (
              <ForumPagination
                pagination={pagination}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            )}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export const initForumPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
