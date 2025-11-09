import type { IncomingMessage } from 'http'

export default function runMiddleware(
  req: IncomingMessage & { cookies?: Record<string, string> },
  middleware: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Express middleware signature: (req, res, next)
    middleware(req, {} as any, (result: unknown) => {
      if (result instanceof Error) reject(result)
      else resolve()
    })
  })
}
