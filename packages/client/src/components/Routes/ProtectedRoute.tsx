import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  } else {
    return <>{children}</>
  }
}
