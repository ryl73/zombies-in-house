import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { SigninPage } from './pages/SigninPage'
import { SignupPage } from './pages/SignupPage'
import { ProfilePage } from './pages/ProfilePage'
import { GamePage } from './pages/GamePage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { ForumPage } from './pages/ForumPage'
import { ForumCreatePage } from './pages/ForumCreate'
import { ForumTopicPage } from './pages/ForumTopicPage'
import { NotFoundPage } from './pages/NotFound'
import { ProtectedRoute } from './components/Routes/ProtectedRoute'
import { OnlyPublicRoute } from './components/Routes/OnlyPublicRoute'
import { GameEnd } from './pages/GameEnd'

function Router() {
  return (
    <Routes>
      <Route
        path="/signin"
        element={
          <OnlyPublicRoute>
            <SigninPage />
          </OnlyPublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <OnlyPublicRoute>
            <SignupPage />
          </OnlyPublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/game"
        element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/forum"
        element={
          <ProtectedRoute>
            <ForumPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forum/create"
        element={
          <ProtectedRoute>
            <ForumCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forum/topic/:id"
        element={
          <ProtectedRoute>
            <ForumTopicPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/game-end"
        element={
          <ProtectedRoute>
            <GameEnd />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default Router
