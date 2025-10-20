import type { NextFunction, Request, Response } from 'express'
import ApiError from '../error/ApiError'
import dotenv from 'dotenv'

dotenv.config()

export const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { authCookie, uuid } = req.cookies

  if (!authCookie || !uuid) {
    // Для запуска в dev режиме подставляем свои куки
    if (process.env.NODE_ENV === 'development') {
      const personalAuthCookie =
        '75b5503611c1b45e91a548caf3757bf2459c0f4e%3A1759249296'
      const personalUuid = 'e878adde-7697-4bc5-878c-600805fe781d'

      req.cookies['authCookie'] = personalAuthCookie
      req.cookies['uuid'] = personalUuid
      return next()
    }
    return next(ApiError.forbidden('User is not authenticated'))
  }
  next()
}
