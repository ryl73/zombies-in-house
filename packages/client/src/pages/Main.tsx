import { Helmet } from 'react-helmet'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const MainPage = () => {
  usePage({ initPage: initMainPage })
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
    </div>
  )
}

export const initMainPage = async (_args: PageInitArgs) => {
  Promise.resolve()
}
