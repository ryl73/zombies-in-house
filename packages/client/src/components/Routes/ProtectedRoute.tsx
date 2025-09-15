import { Navigate } from 'react-router-dom'
import { FC, ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth()
  if (isLoggedIn) {
    return <>{children}</>
  } else {
    return <Navigate to="/signin" replace />
  }
}
