import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs/promises'
import { dbConnect } from './db'
import serialize from 'serialize-javascript'
import cookieParser from 'cookie-parser'
import { router } from './routes'
import http from 'http'
import Wss from './ws'
import { errorHandlingMiddleware } from './middleware/ErrorHandlingMiddleware'
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware'
import helmet from 'helmet'

dotenv.config()

const isDev = process.env.NODE_ENV === 'development'
const port = Number(process.env.SERVER_PORT) || 3001

async function startServer() {
  await dbConnect()

  const app = express()
  const server = http.createServer(app)

  app.use(cookieParser())
  app.use(cors())
  app.use(express.json())
  app.use(
    '/api/v2',
    createProxyMiddleware({
      changeOrigin: true,
      cookieDomainRewrite: {
        '*': '',
      },
      timeout: 5000,
      proxyTimeout: 5000,
      on: {
        proxyReq: fixRequestBody,
      },
      logger: console,
      target: 'https://ya-praktikum.tech/api/v2',
    })
  )
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: false,
      reportOnly: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", ...(isDev ? ["'unsafe-inline'"] : [])],
        styleSrc: [
          "'self'",
          'https://fonts.googleapis.com',
          ...(isDev ? ["'unsafe-inline'"] : []),
        ],
        imgSrc: ["'self'", 'https://ya-praktikum.tech'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: [
          "'self'",
          ...(isDev ? ['http://localhost:3001', 'ws://localhost:24678/'] : []),
          'https://ya-praktikum.tech',
        ],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    })
  )

  app.use('/server/api', router)

  Wss.init(server)

  app.use(errorHandlingMiddleware)

  if (isDev) {
    const vite = await import('vite')
    const viteServer = await vite.createServer({
      root: path.resolve(__dirname, '../../client'),
      server: { middlewareMode: true },
      appType: 'custom',
    })

    app.use(viteServer.middlewares)

    app.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl
        const templatePath = path.resolve(__dirname, '../../client/index.html')
        let template = await fs.readFile(templatePath, 'utf-8')
        template = await viteServer.transformIndexHtml(url, template)

        const { render } = await viteServer.ssrLoadModule(
          '/src/entry-server.tsx'
        )
        const { html, styleTags, helmet, initialState } = await render(req)

        const page = template
          .replace('<!--ssr-styles-->', styleTags || '')
          .replace(
            '<!--ssr-helmet-->',
            helmet
              ? `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
              : ''
          )
          .replace('<!--ssr-outlet-->', html)
          .replace(
            '<!--ssr-initial-state-->',
            `<script>window.__INITIAL_STATE__=${serialize(initialState, {
              isJSON: true,
            })}</script>`
          )

        res.status(200).set({ 'Content-Type': 'text/html' }).end(page)
      } catch (e) {
        viteServer.ssrFixStacktrace(e as Error)
        next(e)
      }
    })
  } else {
    const clientDist = path.resolve(__dirname, '../../client/dist/client')
    const ssrBundlePath = path.resolve(
      __dirname,
      '../../client/dist/server/entry-server.js'
    )

    app.use(express.static(clientDist))

    const { render } = await import(ssrBundlePath)

    app.get('*', async (req, res) => {
      const templatePath = path.join(clientDist, 'index.html')
      let template = await fs.readFile(templatePath, 'utf-8')

      const { html, styleTags, helmet, initialState } = await render(req)

      template = template
        .replace('<!--ssr-styles-->', styleTags || '')
        .replace(
          '<!--ssr-helmet-->',
          helmet
            ? `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
            : ''
        )
        .replace('<!--ssr-outlet-->', html)
        .replace(
          '<!--ssr-initial-state-->',
          `<script>window.__INITIAL_STATE__=${serialize(initialState, {
            isJSON: true,
          })}</script>`
        )

      res.setHeader('Content-Type', 'text/html')
      res.status(200).send(template)
    })
  }

  server.listen(port, () => {
    console.log(`➜ 🎸 Server is listening on http://localhost:${port}`)
  })
}

startServer()
