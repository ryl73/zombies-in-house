import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'

export const LeaderboardPage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Лидерборд</title>
        <meta name="description" content="Страница лидерборда" />
      </Helmet>
      <div>Лидерборд</div>
    </div>
  )
}

export const initLeaderboardPage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
