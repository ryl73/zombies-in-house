export type ApiErrorCodes = 404 | 400 | 500 | 403 | number

export default class ApiError extends Error {
  status: ApiErrorCodes
  details?: unknown

  constructor(status: ApiErrorCodes, message: string, details?: unknown) {
    super()
    this.status = status
    this.message = message
    this.details = details
  }

  static notFound(message: string, details?: unknown) {
    return new ApiError(404, message, details)
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, details)
  }

  static internal(message: string, details?: unknown) {
    return new ApiError(500, message, details)
  }

  static forbidden(message: string, details?: unknown) {
    return new ApiError(403, message, details)
  }

  static create(status: ApiErrorCodes, message: string) {
    return new ApiError(status, message)
  }
}
