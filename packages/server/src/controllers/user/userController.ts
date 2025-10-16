import type { RequestWithCookie } from '../../middleware/AuthMiddleware'
import ApiError from '../../error/ApiError'

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
  static async get(req: RequestWithCookie): Promise<UserInfo> {
    if (!req.userCookie) {
      throw ApiError.forbidden('User is not authenticated')
    }

    const response = await fetch(`${YANDEX_API_ENDPOINT}/auth/user`, {
      method: 'GET',
      headers: {
        Cookie: req.userCookie,
      },
    })
    if (!response.ok) {
      throw ApiError.create(response.status, response.statusText)
    }

    return response.json()
  }
}
