import { Helmet } from 'react-helmet'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { Button } from '../styles/Buttons'
import { logout } from '../api/LoginAPI'
import { useNavigate } from 'react-router-dom'

export const MainPage = () => {
  usePage({ initPage: initMainPage })
  const navigate = useNavigate()
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta
          name="description"
          content="Главная страница с информацией о пользователе"
        />
      </Helmet>
      <Header />
      <Button
        type="button"
        onClick={() => {
          logout().then(() => navigate('/signin'))
        }}>
        ВЫХОД
      </Button>
    </div>
  )
}

export const initMainPage = async (_args: PageInitArgs) => {
  Promise.resolve()
}
