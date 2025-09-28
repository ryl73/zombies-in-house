import { Helmet } from 'react-helmet'
import { useEffect } from 'react'
import { Header } from '../components/Header/Header'
import { Link } from 'react-router-dom'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { logout } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FullscreenToggle } from '../components/FullscreenToggle/FullscreenToggle'

const useStyles = makeStyles(theme => ({
  wrapper: {
    backgroundColor: theme.palette.background.default,
    paddingBottom: theme.spacing(5),
  },
  startGameBtn: {
    width: '100%',
    maxWidth: '435px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    height: '100%',
  },
  cardContent: {
    padding: theme.spacing(3),
  },
  featureTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  featureDescription: {
    color: theme.palette.text.secondary,
    marginTop: '20px',
    fontSize: '18px',
  },
  readyBlockTitle: {
    marginBottom: '2rem',
    marginTop: '4rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  firstScreen: {
    minHeight: 500,
    backgroundImage: 'url(/src/assets/landing-first-screen.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    textAlign: 'center',
    [theme.breakpoints.up('md')]: {
      minHeight: 660,
    },
  },
  contentContainer: {
    paddingBottom: '4rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '435px !important',
  },
  featuresSection: {
    backgroundColor: theme.palette.background.default,
  },
  iconWrapper: {
    display: 'inline-flex',
    padding: theme.spacing(1),
    backgroundColor: '#355155',
    borderRadius: theme.spacing(0.75),
    marginRight: theme.spacing(2),
    flexShrink: 0,
    '& svg': {
      color: '#121212',
      fontSize: '2rem',
    },
  },
  readyBlockButton: {
    maxWidth: '250px',
    width: '100%',
    padding: theme.spacing(1.5, 3),
    fontSize: '1.1rem',
  },
}))

const features = [
  {
    icon: <span>🔍</span>,
    title: 'Исследуй',
    description:
      'Обыскивай комнаты в\u00A0поисках оружия, аптечек и\u00A0ключей к\u00A0выходу. Каждый шаг может быть последним',
  },
  {
    icon: <span>⚔️</span>,
    title: 'Сражайся',
    description:
      'Отбивайся от\u00A0полчищ мертвецов. Используй всё, что\u00A0попадётся под\u00A0руку\u00A0— от\u00A0биты до\u00A0дробовика',
  },
  {
    icon: <span>🛡️</span>,
    title: 'Выживай',
    description:
      'Держись вместе с\u00A0другими выжившими. Только команда поможет вам\u00A0дожить до\u00A0рассвета',
  },
]

export const MainPage = () => {
  usePage({ initPage: initMainPage })
  const { isLoggedIn, clearUser } = useAuth()
  const navigate = useNavigate()
  const classes = useStyles()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin')
    }
  }, [isLoggedIn, navigate])

  return (
    <Box className={classes.wrapper}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta
          name="description"
          content="Главная страница с информацией о пользователе"
        />
      </Helmet>

      <Box className={classes.firstScreen}>
        <FullscreenToggle />
        <Container maxWidth="lg" className={classes.contentContainer}>
          <Typography variant="h1" gutterBottom>
            Зомби в&nbsp;доме
          </Typography>
          <Button
            component={Link}
            to="/game"
            variant="contained"
            size="large"
            color="primary"
            className={classes.startGameBtn}>
            Начать игру
          </Button>
        </Container>
      </Box>

      <Header />

      <Container maxWidth="lg" className={classes.featuresSection}>
        <Box mt={8}>
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            Правила Выживания
          </Typography>
        </Box>
        <Box mt={8}>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box className={classes.iconWrapper}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        className={classes.featureTitle}>
                        {feature.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      className={classes.featureDescription}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography
          variant="h4"
          component="h4"
          className={classes.readyBlockTitle}>
          Готов проверить себя на прочность?
        </Typography>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            component={Link}
            to="/game"
            variant="contained"
            color="primary"
            className={classes.readyBlockButton}>
            Я готов!
          </Button>
          <Button
            component={Link}
            onClick={() => {
              logout().then(() => clearUser())
            }}
            to="/signin"
            variant="contained"
            color="primary"
            className={classes.readyBlockButton}>
            Выход
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export const initMainPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
