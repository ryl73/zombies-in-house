import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { AppErrorBoundary } from './components/ErrorBoundary/AppErrorBoundary'
import './index.css'
import Router from './Router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppErrorBoundary>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AppErrorBoundary>
  </Provider>
)
