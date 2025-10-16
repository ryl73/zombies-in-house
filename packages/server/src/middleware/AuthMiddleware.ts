import type { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'

export type RequestWithCookie<
  params = unknown,
  res = unknown,
  req = unknown
> = Request<params, res, req> & {
  userCookie?: string
}

export const authMiddleware = (
  req: RequestWithCookie,
  _: Response,
  next: NextFunction
) => {
  if (!req.headers.cookie) {
    return next(ApiError.forbidden('User is not authenticated'))
  }
  req.userCookie = req.headers.cookie
  next()
}
