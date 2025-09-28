import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Box, Container, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.background.default,
  },
  header: {
    fontSize: '120px',
  },
  startBtn: {
    width: '100%',
    maxWidth: '435px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  firstScreen: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'center',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url(src/assets/landing-first-screen.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(4px)',
      zIndex: 1,
    },
  },
  contentContainer: {
    paddingBottom: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '800px !important',
    zIndex: 2,
  },
}))

export const GameStart = () => {
  usePage({ initPage: initGameStart })
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Начало игры</title>
        <meta name="description" content="Экран для того чтобы начать игру" />
      </Helmet>

      <Box className={classes.firstScreen}>
        <Container maxWidth="lg" className={classes.contentContainer}>
          <Typography variant="h1" gutterBottom className={classes.header}>
            Зомби в&nbsp;доме
          </Typography>
          <Box position="absolute" top="20px" width="100%">
            <Button variant="contained" component={Link} to="/" color="primary">
              На главную
            </Button>
          </Box>
          <Button
            component={Link}
            to="/game"
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            className={classes.startBtn}>
            Старт
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export const initGameStart = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
