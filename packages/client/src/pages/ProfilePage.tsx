import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { ChangePasswordForm } from '../components/ChangePasswordForm/ChangePasswordForm'
import { Box, makeStyles, Typography } from '@material-ui/core'
import { ChangeProfileForm } from '../components/ProfileForm/ProfileForm'
import { AvatarInput } from '../components/AvatarInput/AvatarInput'
import { Header } from '../components/Header/Header'

const useStyles = makeStyles(theme => ({
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: 'var(--color-bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pageContent: {
    padding: '20px',
  },
  themedHeader: {
    fontFamily: 'Rubik Wet Paint, cursive',
    textAlign: 'center',
    color: 'var(--color-primary)',
    fontSize: '64px',
    lineHeight: '64px',
  },
}))

export const ProfilePage = () => {
  const classes = useStyles()

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Профиль пользователя" />
      </Helmet>
      <Box className={classes.pageContainer}>
        <Header />
        <div className={classes.pageContent}>
          <Typography variant="h1" className={classes.themedHeader}>
            Профиль
          </Typography>
          <AvatarInput />
          <ChangeProfileForm />
          <Typography variant="h2" component="h2" align="center" gutterBottom>
            Смена пароля
          </Typography>
          <ChangePasswordForm />
        </div>
      </Box>
    </div>
  )
}

export const initProfilePage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
