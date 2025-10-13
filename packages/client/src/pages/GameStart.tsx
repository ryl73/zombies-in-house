import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Box, Container, Typography, Button } from '@material-ui/core'
import { useGlobalStyles } from '../styles/mui/GlobalStyles'
import { useGameStatusStyles } from '../styles/mui/GameStatusStyles'

export const GameStart = () => {
  usePage({ initPage: initGameStart })
  const classes = useGameStatusStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box>
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
            className={globalClasses.mainBtn}>
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
