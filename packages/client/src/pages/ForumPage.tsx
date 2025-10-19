import { useState, useMemo } from 'react'
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
  TextField,
  InputAdornment,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Search } from '@material-ui/icons'
import { TopicItem } from '../components/Forum/TopicItem'
import { Topic } from '../types/types'
import { mockTopics } from '../utils/mockData'

const useStyles = makeStyles(theme => ({
  wrapper: {
    minHeight: '100vh',
    fontSize: '20px',
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
  searchField: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8, 2),
  },
  createTopicBtn: {
    whiteSpace: 'nowrap',
    minWidth: '175px',
  },
}))

export const ForumPage = () => {
  usePage({ initPage: initForumPage })
  const classes = useStyles()
  const [searchQuery, setSearchQuery] = useState('')
  const [topics] = useState<Topic[]>(mockTopics)
  const filteredTopics = useMemo(() => {
    return topics.filter(
      topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, topics])

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
          <Box display="flex" alignItems="center">
            <TextField
              placeholder="Поиск по форуму..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={classes.searchField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="inherit" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              component={Link}
              to="/forum/create"
              variant="contained"
              color="primary"
              className={classes.createTopicBtn}>
              Создать топик
            </Button>
          </Box>
        </Box>

        {filteredTopics.length === 0 ? (
          <Box className={classes.emptyState}>
            <Typography variant="h5" color="textPrimary" gutterBottom>
              {searchQuery ? 'Ничего не найдено' : 'Пока нет топиков'}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {searchQuery
                ? 'Попробуйте изменить поисковый запрос'
                : 'Будьте первым, кто создаст топик для обсуждения!'}
            </Typography>
            {!searchQuery && (
              <Button
                component={Link}
                to="/forum/create"
                variant="contained"
                color="primary"
                size="large">
                Создать первый топик
              </Button>
            )}
          </Box>
        ) : (
          <Box>
            {filteredTopics.map(topic => (
              <TopicItem key={topic.id} topic={topic} isContent={false} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  )
}

export const initForumPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
