import { Helmet } from 'react-helmet'
import { useEffect } from 'react'
import { Header } from '../components/Header'
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
  useTheme,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { logout } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FullscreenToggle } from '../components/FullscreenToggle/FullscreenToggle'

const useStyles = makeStyles(theme => ({
  firstScreen: {
    minHeight: 500,
    backgroundImage: 'url(/images/landing-first-screen.webp)',
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
    padding: '8px',
    backgroundColor: '#355155',
    borderRadius: '6px',
    marginRight: '16px',
    flexShrink: 0,
    '& svg': {
      color: '#121212',
      fontSize: '2rem',
    },
  },
  readyButton: {
    maxWidth: '250px',
    width: '100%',
    padding: '12px 24px',
    fontSize: '1.1rem',
  },
}))

export const MainPage = () => {
  usePage({ initPage: initMainPage })
  const { isLoggedIn, clearUser } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const classes = useStyles()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/signin')
    }
  }, [isLoggedIn, navigate])

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

  return (
    <Box style={{ backgroundColor: theme.palette.background.default }} pb={5}>
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
            style={{
              width: '100%',
              maxWidth: '435px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
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
                <Card style={{ height: '100%' }}>
                  <CardContent style={{ padding: '24px' }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box className={classes.iconWrapper}>{feature.icon}</Box>
                      <Typography
                        variant="h6"
                        component="h3"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                        {feature.title}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      style={{
                        color: theme.palette.text.secondary,
                        marginTop: '20px',
                        fontSize: '18px',
                      }}>
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
          align="center"
          gutterBottom
          style={{
            marginBottom: '2rem',
            marginTop: '4rem',
            fontWeight: 'bold',
          }}>
          Готов проверить себя на прочность?
        </Typography>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            component={Link}
            to="/game"
            variant="contained"
            color="primary"
            className={classes.readyButton}>
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
            className={classes.readyButton}>
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
