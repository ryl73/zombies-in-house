import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'

export const ProfilePage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Профиль пользователя" />
      </Helmet>
      <div>Профиль</div>
    </div>
  )
}

export const initProfilePage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
