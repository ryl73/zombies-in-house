import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { store } from './store'
import { AppErrorBoundary } from './components/ErrorBoundary/AppErrorBoundary'
import './index.css'
import { theme } from './theme/theme'
import { NotificationProvider } from './hooks/useNotification'
import App from './App'
import { startServiceWorker } from './serviceWorkers'
import { CssBaseline } from '@material-ui/core'

if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister())
  })
}

if (process.env.NODE_ENV === 'development' && 'caches' in window) {
  caches.keys().then(keys => keys.forEach(key => caches.delete(key)))
}

function Main() {
  React.useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppErrorBoundary>
          <NotificationProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotificationProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    </Provider>
  )
}

ReactDOM.hydrateRoot(document.getElementById('root') as HTMLElement, <Main />)

if (process.env.NODE_ENV === 'production') {
  startServiceWorker()
}
