import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'

export const ForumTopicPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Топик форума</title>
        <meta name="description" content="Страница топика форума" />
      </Helmet>
      <div>Топик форума</div>
    </div>
  )
}

export const initForumTopicPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
