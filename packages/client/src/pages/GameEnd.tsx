import { Helmet } from 'react-helmet'
import { Link, useLocation } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Box, Container, Typography, Button, useTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
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

export const GameEnd = () => {
  usePage({ initPage: initGameEnd })
  const location = useLocation()
  const { gameResult } = location.state === null ? '' : location.state
  const theme = useTheme()
  const classes = useStyles()

  return (
    <Box style={{ backgroundColor: theme.palette.background.default }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Конец игры</title>
        <meta name="description" content="Экран окончания игры" />
      </Helmet>

      <Box className={classes.firstScreen}>
        <Container maxWidth="lg" className={classes.contentContainer}>
          <Typography variant="h1" gutterBottom style={{ fontSize: '120px' }}>
            Зомби в&nbsp;доме
          </Typography>
          <Box position="absolute" top="20px" width="100%">
            <Typography variant="h1" gutterBottom style={{ fontSize: '60px' }}>
              {gameResult === 'win'
                ? 'Вы спаслись!'
                : 'В следующий раз обязательно получиться.'}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/game"
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            style={{
              width: '100%',
              maxWidth: '435px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}>
            Повторить
          </Button>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            style={{
              width: '100%',
              maxWidth: '435px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
            }}>
            Вернуться в главное меню
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export const initGameEnd = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
