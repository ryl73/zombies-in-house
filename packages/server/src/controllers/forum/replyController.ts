import type { NextFunction, Request, Response } from 'express'
import Reply from '../../models/forum/Reply'
import ApiError from '../../error/ApiError'
import UserController from '../user/userController'
import type { RequestWithCookie } from '../../middleware/AuthMiddleware'

export type ReplyCreateRequest = {
  message: string
  commentId: string
}

export default class ReplyController {
  static async create(
    req: RequestWithCookie<unknown, unknown, ReplyCreateRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req)
      const { message, commentId } = req.body

      const reply = await Reply.create({
        authorLogin: user.login,
        authorAvatar: user.avatar,
        message,
        commentId,
      })

      res.status(201).json({ id: reply.id })
    } catch (e) {
      next(ApiError.badRequest('Failed to create reply', e))
    }
  }

  static async getByCommentId(
    req: Request<{ commentId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { commentId } = req.params

      const commentReplies = await Reply.findAll({ where: { commentId } })

      res.status(200).json(commentReplies)
    } catch (e) {
      next(ApiError.badRequest('Failed to get all replies', e))
    }
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const reply = await Reply.findByPk(id)

      if (!reply) {
        return next(ApiError.badRequest('Reply not found'))
      }

      res.status(200).json(reply)
    } catch (e) {
      next(ApiError.badRequest('Failed to get reply', e))
    }
  }

  static async deleteById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const reply = await Reply.findByPk(id)

      if (!reply) {
        return next(ApiError.badRequest('Reply not found'))
      }

      await reply.destroy()

      res.status(201).json({ message: 'Reply deleted' })
    } catch (e) {
      next(ApiError.badRequest('Failed to delete reply', e))
    }
  }

  static async updateById(
    req: Request<
      { id: string },
      unknown,
      Omit<ReplyCreateRequest, 'commentId'>
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const reply = await Reply.findByPk(id)

      if (!reply) {
        return next(ApiError.badRequest('Reply not found'))
      }

      await reply.update(req.body)

      res.status(200).json(reply)
    } catch (e) {
      next(ApiError.badRequest('Failed to get reply', e))
    }
  }
}
