'use client'

import { makeStyles } from '@material-ui/core'
import { ReactNode } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

interface AppErrorBoundaryProps {
  children?: ReactNode
}

const useStyles = makeStyles({
  errorMessage: {
    color: 'red',
  },
  link: {
    display: 'inline-block',
    marginLeft: '1rem',
  },
})

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const classes = useStyles()

  return (
    <div role="alert">
      <p>Что-то пошло не так:</p>
      <pre className={classes.errorMessage}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Попробовать еще раз</button>
      <a href="/" className={classes.link}>
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
