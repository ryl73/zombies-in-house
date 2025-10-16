import ApiError from '../../error/ApiError'
import type { Request } from 'express'

const YANDEX_API_ENDPOINT = 'https://ya-praktikum.tech/api/v2'

export type UserInfo = {
  id: number
  first_name: string
  second_name: string
  display_name: string
  login: string
  avatar: string
  email: string
  phone: string
}

export default class UserController {
  static async get(req: Request<unknown, unknown, unknown>): Promise<UserInfo> {
    const { authCookie, uuid } = req.cookies

    if (!authCookie || !uuid) {
      throw ApiError.forbidden('User is not authenticated')
    }

    const forwardedCookies = [
      authCookie && `sessionId=${authCookie}`,
      uuid && `authToken=${uuid}`,
    ]
      .filter(Boolean)
      .join('; ')

    const response = await fetch(`${YANDEX_API_ENDPOINT}/auth/user`, {
      method: 'GET',
      headers: {
        Cookie: forwardedCookies,
      },
    })
    if (!response.ok) {
      throw ApiError.create(response.status, response.statusText)
    }

    return response.json()
  }
}
