import type { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'

export const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { authCookie, uuid } = req.cookies

  if (!authCookie || !uuid) {
    return next(ApiError.forbidden('User is not authenticated'))
  }
  next()
}
