'use client'

import { useRouteError } from 'react-router-dom'
import { Fallback } from './AppErrorBoundary'

export function RouteErrorFallback() {
  const error = useRouteError()
  console.error('Route error:', error)

  return (
    <Fallback
      error={error}
      resetErrorBoundary={() => window.location.reload()}
    />
  )
}
