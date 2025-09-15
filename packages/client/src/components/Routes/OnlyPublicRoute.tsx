import { Navigate } from 'react-router-dom'
import { FC, ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export const OnlyPublicRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth()
  if (isLoggedIn) {
    return <Navigate to="/" replace />
  } else {
    return <>{children}</>
  }
}
