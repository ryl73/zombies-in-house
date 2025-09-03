import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { store } from './store'
import { AppErrorBoundary } from './components/ErrorBoundary/AppErrorBoundary'
import './index.css'
import Router from './Router'
import { theme } from './theme/theme'

const router = createBrowserRouter(routes)

const jssStyles = document.getElementById('jss-server-side')
if (jssStyles) {
  jssStyles.parentElement?.removeChild(jssStyles)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <AppErrorBoundary>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AppErrorBoundary>
    </Provider>
  </ThemeProvider>
)
