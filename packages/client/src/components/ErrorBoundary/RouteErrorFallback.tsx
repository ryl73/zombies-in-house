'use client'
import { useRouteError, useNavigate } from 'react-router-dom'
import { Fallback } from './AppErrorBoundary'
import { useEffect } from 'react'
import { AppError, ErrorCode } from '../../utils/errorHandling'

function isErrorWithStatus(
  error: unknown
): error is { status: number; message: string } {
  return typeof error === 'object' && error !== null && 'status' in error
}

export function RouteErrorFallback() {
  const error = useRouteError()
  const navigate = useNavigate()
  useEffect(() => {
    if (error instanceof AppError) {
      if (error.status === ErrorCode.NOT_FOUND) {
        navigate('/404', { replace: true, state: { error: error.message } })
      } else if (error.status === ErrorCode.SERVER_ERROR) {
        navigate('/500', { replace: true, state: { error: error.message } })
      }
    } else if (isErrorWithStatus(error)) {
      if (error.status === 404) {
        navigate('/404', { replace: true, state: { error: error.message } })
      } else if (error.status === 500) {
        navigate('/500', { replace: true, state: { error: error.message } })
      }
    }
  }, [error, navigate])
  return (
    <Fallback
      error={error instanceof Error ? error : new Error('Unknown error')}
      resetErrorBoundary={() => window.location.reload()}
    />
  )
}
