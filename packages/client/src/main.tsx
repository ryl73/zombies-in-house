import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core/styles'
import { store } from './store'
import { routes } from './routes'
import { AppErrorBoundary } from './components/ErrorBoundary/AppErrorBoundary'
import './index.css'
import { theme } from './theme/theme'

const router = createBrowserRouter(routes)

// Удаляем серверные стили после гидратации
const jssStyles = document.getElementById('jss-server-side')
if (jssStyles) {
  jssStyles.parentElement?.removeChild(jssStyles)
}

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <AppErrorBoundary>
        <RouterProvider router={router} />
      </AppErrorBoundary>
    </Provider>
  </ThemeProvider>
)
