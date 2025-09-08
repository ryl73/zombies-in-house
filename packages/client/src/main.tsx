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

const jssStyles = document.getElementById('jss-server-side')
if (jssStyles) {
  jssStyles.parentElement?.removeChild(jssStyles)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <AppErrorBoundary>
        <NotificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationProvider>
      </AppErrorBoundary>
    </Provider>
  </ThemeProvider>
)
