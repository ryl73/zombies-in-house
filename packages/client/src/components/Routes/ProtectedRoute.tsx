import { Navigate } from 'react-router-dom'
import { isUserLoggedIn } from '../../slices/userSlice'
import { useAppSelector } from '../../hooks/useApp'
import { FC, ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = useAppSelector(isUserLoggedIn)
  if (isLoggedIn) {
    return <>{children}</>
  } else {
    return <Navigate to="/signin" replace />
  }
}
