import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/MainPage'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { ServerErrorPage, initServerErrorPage } from './pages/ServerErrorPage'
import { initSigninPage, SigninPage } from './pages/SigninPage'
import { initSignupPage, SignupPage } from './pages/SignupPage'
import { initProfilePage, ProfilePage } from './pages/ProfilePage'
import { GamePage, initGamePage } from './pages/GamePage'
import { GameStart, initGameStart } from './pages/GameStart'
import { initLeaderboardPage, LeaderboardPage } from './pages/LeaderboardPage'
import { ForumPage, initForumPage } from './pages/ForumPage'
import { ForumTopicPage, initForumTopicPage } from './pages/ForumTopicPage'
import { RouteErrorFallback } from './components/ErrorBoundary/RouteErrorFallback'
import { GameEnd, initGameEnd } from './pages/GameEnd'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

type Route = {
  path: string
  Component: React.ComponentType
  fetchData: (args: PageInitArgs) => Promise<unknown>
  errorElement?: React.ReactNode
}

export const routes: Route[] = [
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '/signin',
    Component: SigninPage,
    fetchData: initSigninPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
    fetchData: initSignupPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
    fetchData: initProfilePage,
  },
  {
    path: '/game',
    Component: GamePage,
    fetchData: initGamePage,
  },
  {
    path: '/game-start',
    Component: GameStart,
    fetchData: initGameStart,
  },
  {
    path: '/game-end',
    Component: GameEnd,
    fetchData: initGameEnd,
  },
  {
    path: '/leaderboard',
    Component: LeaderboardPage,
    fetchData: initLeaderboardPage,
  },
  {
    path: '/forum',
    Component: ForumPage,
    fetchData: initForumPage,
  },
  {
    path: '/forum/topic',
    Component: ForumTopicPage,
    fetchData: initForumTopicPage,
  },
  {
    path: '/404',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
  {
    path: '/500',
    Component: ServerErrorPage,
    fetchData: initServerErrorPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]

const errorFallback = <RouteErrorFallback />
routes.forEach(route => {
  route.errorElement = errorFallback
})
