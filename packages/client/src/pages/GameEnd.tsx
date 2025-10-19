import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Box, Container, Typography, Button } from '@material-ui/core'
import { useAppSelector } from '../hooks/useApp'
import { useGlobalStyles } from '../styles/mui/GlobalStyles'
import { useGameStatusStyles } from '../styles/mui/GameStatusStyles'

export const GameEnd = () => {
  usePage({ initPage: initGameEnd })
  const { status } = useAppSelector(state => state.game)
  const classes = useGameStatusStyles()
  const globalClasses = useGlobalStyles()

  return (
    <Box>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Конец игры</title>
        <meta name="description" content="Экран окончания игры" />
      </Helmet>

      <Box className={classes.firstScreen}>
        <Container maxWidth="lg" className={classes.contentContainer}>
          <Typography variant="h1" gutterBottom className={classes.header}>
            Зомби в&nbsp;доме
          </Typography>
          <Box position="absolute" top="20px" width="100%">
            <Typography
              variant="h1"
              component="h2"
              gutterBottom
              className={classes.statusHeader}>
              {status === 'won'
                ? 'Вы спаслись!'
                : 'В следующий раз обязательно получится!'}
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/game"
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            className={globalClasses.mainBtn}>
            Повторить
          </Button>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            color="primary"
            fullWidth
            className={globalClasses.mainBtn}>
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
