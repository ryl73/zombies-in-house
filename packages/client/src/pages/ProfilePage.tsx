import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { ChangePasswordForm } from '../components/ChangePasswordForm/ChangePasswordForm'
import { Box, Container, makeStyles, Typography } from '@material-ui/core'
import { ChangeProfileForm } from '../components/ProfileForm/ProfileForm'
import { AvatarInput } from '../components/AvatarInput/AvatarInput'
import { Header } from '../components/Header/Header'
import { useGlobalStyles } from '../styles/mui/GlobalStyles'

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
}))

export const ProfilePage = () => {
  const classes = useStyles()
  const globalClasses = useGlobalStyles()

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Профиль пользователя" />
      </Helmet>
      <Header />
      <Container maxWidth="lg" className={classes.container}>
        <Box>
          <Typography variant="h2" align="center" gutterBottom>
            Профиль
          </Typography>
          <AvatarInput />
          <ChangeProfileForm />
          <Typography variant="h2" align="center" gutterBottom>
            Смена пароля
          </Typography>
          <ChangePasswordForm />
        </Box>
      </Container>
    </div>
  )
}

export const initProfilePage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
