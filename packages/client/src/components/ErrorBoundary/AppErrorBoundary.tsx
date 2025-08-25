'use client'

import { ReactNode } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

interface AppErrorBoundaryProps {
  children?: ReactNode
}

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Что-то пошло не так:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Попробовать еще раз</button>
      <a href="/" style={{ marginLeft: '1rem', display: 'inline-block' }}>
        На главную
      </a>
    </div>
  )
}

export const AppErrorBoundary = ({ children }: AppErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onError={(error, info) => {
        console.error('Error caught by boundary:', error, info.componentStack)
      }}>
      {children}
    </ErrorBoundary>
  )
}
