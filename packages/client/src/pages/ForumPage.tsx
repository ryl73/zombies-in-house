import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'

export const ForumPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Форум</title>
        <meta name="description" content="Страница форума" />
      </Helmet>
      <div>Форум</div>
    </div>
  )
}

export const initForumPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
