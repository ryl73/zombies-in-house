import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { ThemedHeader } from '../styles/ThemedHeader'
import { PageContainer } from '../styles/PageContainer'
import { ChangePasswordForm } from '../components/ChangePasswordForm/ChangePasswordForm'
import { Typography } from '@material-ui/core'
import { ChangeProfileForm } from '../components/ProfileForm/ProfileForm'

export const ProfilePage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Профиль пользователя" />
      </Helmet>
      <PageContainer>
        <ThemedHeader>Профиль</ThemedHeader>
        <ChangeProfileForm />
        <Typography variant="h2" component="h2" align="center" gutterBottom>
          Смена пароля
        </Typography>
        <ChangePasswordForm />
      </PageContainer>
    </div>
  )
}

export const initProfilePage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
