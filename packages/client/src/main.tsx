import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { store } from './store'
import { routes } from './routes'
import { AppErrorBoundary } from './components/ErrorBoundary/AppErrorBoundary'
import { theme } from './theme/theme'
import { startServiceWorker } from './serviceWorkers'
import { CssBaseline } from '@material-ui/core'
import './index.css'

const router = createBrowserRouter(routes)

if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister())
  })
}

function Main() {
  React.useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppErrorBoundary>
          <RouterProvider router={router} />
        </AppErrorBoundary>
      </Provider>
    </ThemeProvider>
  )
}

ReactDOM.hydrateRoot(document.getElementById('root') as HTMLElement, <Main />)

if (process.env.NODE_ENV === 'production') {
  startServiceWorker()
}
