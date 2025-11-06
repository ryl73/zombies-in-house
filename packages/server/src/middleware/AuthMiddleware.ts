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
    // if (process.env.NODE_ENV === 'development') {
    //   const randomIndex = Math.floor(Math.random() * 2)
    //   const personalAuthCookie = [
    //     '75b5503611c1b45e91a548caf3757bf2459c0f4e%3A1759249296',
    //     '38f522e70edbb3d4145a3d8dfd4eaa179f7ff4c9%3A1760967401',
    //   ]
    //   const personalUuid = [
    //     'e878adde-7697-4bc5-878c-600805fe781d',
    //     '41651958-c8c8-4c49-a826-1cc5b4c3f6da',
    //   ]
    //
    //   req.cookies['authCookie'] = personalAuthCookie[randomIndex]
    //   req.cookies['uuid'] = personalUuid[randomIndex]
    //   return next()
    // }
    return next(ApiError.forbidden('User is not authenticated'))
  }
  next()
}
