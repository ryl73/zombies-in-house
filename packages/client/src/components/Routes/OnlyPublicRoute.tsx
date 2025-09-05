import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const OnlyPublicRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  } else {
    return <>{children}</>
  }
}
