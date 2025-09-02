import { useNavigate } from 'react-router-dom'

export enum ErrorCode {
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
}

export type RouteError = {
  code: ErrorCode
  message: string
}

export const useErrorNavigation = () => {
  const navigate = useNavigate()

  const navigateToErrorPage = (code: ErrorCode, message: string) => {
    const errorRoutes: Record<ErrorCode, string> = {
      [ErrorCode.NOT_FOUND]: '/404',
      [ErrorCode.SERVER_ERROR]: '/500',
      [ErrorCode.UNAUTHORIZED]: '/500',
    }

    const route = errorRoutes[code] || '/500'

    navigate(route, {
      replace: true,
      state: { error: message },
    })
  }

  return navigateToErrorPage
}

export class AppError extends Error {
  status: number

  constructor(message: string, status = 500) {
    super(message)
    this.status = status
    this.name = 'AppError'
  }
}

export function handleApiError(response: Response) {
  if (!response.ok) {
    throw new AppError(
      `HTTP error! status: ${response.status}`,
      response.status
    )
  }
  return response
}
