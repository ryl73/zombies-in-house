import React from 'react'
import ReactDOM from 'react-dom/server'
import { Provider } from 'react-redux'
import { ServerStyleSheet } from 'styled-components'
import { Helmet } from 'react-helmet'
import { Request as ExpressRequest } from 'express'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { matchRoutes } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles' // Добавлен ServerStyleSheets

import {
  createContext,
  createFetchRequest,
  createUrl,
} from './entry-server.utils'
import { reducer } from './store'
import { routes } from './routes'
import './index.css'
import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice'
import { theme } from './theme/theme'

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes)
  const fetchRequest = createFetchRequest(req)
  const context = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  const store = configureStore({
    reducer,
  })

  const url = createUrl(req)

  const foundRoutes = matchRoutes(routes, url)
  if (!foundRoutes) {
    throw new Error('Страница не найдена!')
  }

  const [
    {
      route: { fetchData },
    },
  ] = foundRoutes

  try {
    await fetchData({
      dispatch: store.dispatch,
      state: store.getState(),
      ctx: createContext(req),
    })
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e)
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true))

  // Создаем коллекторы стилей для Material-UI и styled-components
  const materialSheets = new ServerStyleSheets()
  const styledComponentsSheet = new ServerStyleSheet()

  const router = createStaticRouter(dataRoutes, context)

  try {
    const html = ReactDOM.renderToString(
      materialSheets.collect(
        // Собираем стили Material-UI
        styledComponentsSheet.collectStyles(
          // Собираем стили styled-components
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <StaticRouterProvider router={router} context={context} />
            </Provider>
          </ThemeProvider>
        )
      )
    )

    // Получаем стили из обеих библиотек
    const materialCss = materialSheets.toString()
    const styledComponentsTags = styledComponentsSheet.getStyleTags()

    const helmet = Helmet.renderStatic()

    return {
      html,
      helmet,
      styleTags: `<style id="jss-server-side">${materialCss}</style>${styledComponentsTags}`,
      initialState: store.getState(),
    }
  } finally {
    styledComponentsSheet.seal()
  }
}
