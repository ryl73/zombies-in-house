import type { NextFunction, Request, Response } from 'express'
import Comment from '../../models/forum/Comment'
import ApiError from '../../error/ApiError'
import UserController from '../user/userController'
import type { RequestWithCookie } from '../../middleware/AuthMiddleware'

export type CommentCreateRequest = {
  topicId: string
  message: string
}

export default class CommentController {
  static async create(
    req: RequestWithCookie<unknown, unknown, CommentCreateRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req)
      const { topicId, message } = req.body

      const comment = await Comment.create({
        authorLogin: user.login,
        authorAvatar: user.avatar,
        topicId,
        message,
      })

      res.status(201).json({ id: comment.id })
    } catch (e) {
      next(ApiError.badRequest('Failed to create comment', e))
    }
  }

  static async getByTopicId(
    req: Request<{ topicId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { topicId } = req.params

      const topicComments = await Comment.findAll({ where: { topicId } })

      res.status(200).json(topicComments)
    } catch (e) {
      next(ApiError.badRequest('Failed to get all comments', e))
    }
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const comment = await Comment.findByPk(id)

      if (!comment) {
        return next(ApiError.notFound('Comment not found'))
      }

      res.status(200).json(comment)
    } catch (e) {
      next(ApiError.badRequest('Failed to get comment', e))
    }
  }
}
