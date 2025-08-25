import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'

export const GamePage = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <div>Игра</div>
    </div>
  )
}

export const initGamePage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
