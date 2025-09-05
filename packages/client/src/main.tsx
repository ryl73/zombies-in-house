import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { store } from './store'
import { AppErrorBoundary } from './components/ErrorBoundary/AppErrorBoundary'
import Router from './Router'
import { theme } from './theme/theme'
import { startServiceWorker } from './serviceWorkers'
import { CssBaseline } from '@material-ui/core'
import './index.css'

if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(reg => reg.unregister())
  })
}

function Main() {
  // React.useEffect(() => {
  //   const jssStyles = document.getElementById('jss-server-side')
  //   if (jssStyles) {
  //     jssStyles.parentElement?.removeChild(jssStyles)
  //   }
  // }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppErrorBoundary>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </AppErrorBoundary>
      </Provider>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Main />
)

if (process.env.NODE_ENV === 'production') {
  startServiceWorker()
}
