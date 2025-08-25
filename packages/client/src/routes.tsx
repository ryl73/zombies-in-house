import { AppDispatch, RootState } from './store'

import { initMainPage, MainPage } from './pages/Main'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { initSigninPage, SigninPage } from './pages/SigninPage'
import { initSignupPage, SignupPage } from './pages/SignupPage'
import { initProfilePage, ProfilePage } from './pages/ProfilePage'
import { GamePage, initGamePage } from './pages/GamePage'
import { initLeaderboardPage, LeaderboardPage } from './pages/LeaderboardPage'
import { ForumPage, initForumPage } from './pages/ForumPage'
import { ForumTopicPage, initForumTopicPage } from './pages/ForumTopicPage'
import { RouteErrorFallback } from './components/ErrorBoundary/RouteErrorFallback'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export const routes = [
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
    errorElement: <RouteErrorFallback />,
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
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
