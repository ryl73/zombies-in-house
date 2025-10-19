import ApiError from '../error/ApiError'
import type { NextFunction, Response, Request } from 'express'

export const errorHandlingMiddleware = (
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, details: err.details })
  }
  return res.status(500).json({ message: 'Unknown error' })
}
