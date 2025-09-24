import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { createClientAndConnect } from './db'

dotenv.config()

const isDev = process.env.NODE_ENV === 'development'
const port = Number(process.env.SERVER_PORT) || 3001

async function startServer() {
  const app = express()
  app.use(cors())

  createClientAndConnect()

  if (isDev) {
    const vite = await import('vite')
    const viteServer = await vite.createServer({
      root: path.resolve(__dirname, '../../client'),
      server: { middlewareMode: 'ssr' },
      appType: 'custom',
    })

    app.use(viteServer.middlewares)

    app.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl
        const templatePath = path.resolve(__dirname, '../../client/index.html')
        let template = fs.readFileSync(templatePath, 'utf-8')
        template = await viteServer.transformIndexHtml(url, template)

        const { render } = await viteServer.ssrLoadModule(
          '/src/entry-server.tsx'
        )
        const { html, styleTags, helmet, initialState } = await render(req)

        const page = template
          .replace('<!--ssr-styles-->', styleTags || '')
          .replace(
            '<!--ssr-helmet-->',
            helmet ? `${helmet.title.toString()}${helmet.meta.toString()}` : ''
          )
          .replace('<!--ssr-outlet-->', html)
          .replace(
            '<!--ssr-initial-state-->',
            `<script>window.__INITIAL_STATE__=${initialState}</script>`
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

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { render } = require(ssrBundlePath)

    app.get('*', async (req, res) => {
      const templatePath = path.join(clientDist, 'index.html')
      let template = fs.readFileSync(templatePath, 'utf8')

      const { html, styleTags, helmet, initialState } = await render(req)

      template = template
        .replace('<!--ssr-styles-->', styleTags || '')
        .replace(
          '<!--ssr-helmet-->',
          helmet ? `${helmet.title.toString()}${helmet.meta.toString()}` : ''
        )
        .replace('<!--ssr-outlet-->', html)
        .replace(
          '<!--ssr-initial-state-->',
          `<script>window.__INITIAL_STATE__=${initialState}</script>`
        )

      res.setHeader('Content-Type', 'text/html')
      res.status(200).send(template)
    })
  }

  app.listen(port, () => {
    console.log(`➜ 🎸 Server is listening on http://localhost:${port}`)
  })
}

startServer()
