import type { NextFunction, Request, Response } from 'express'
import Comment from '../../models/forum/Comment'
import ApiError from '../../error/ApiError'
import UserController from '../user/userController'
import Reply from '../../models/forum/Reply'
import Reaction from '../../models/forum/Reaction'
import { paginateAndSearch } from '../../helpers/paginationAndSearch'

export type CommentCreateRequest = {
  topicId: string
  message: string
}

export default class CommentController {
  static async create(
    req: Request<unknown, unknown, CommentCreateRequest>,
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
    req: Request<{ topicId: string; page: string; limit: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { topicId, page, limit } = req.params

      const paginatedComments = await paginateAndSearch(
        Comment,
        {
          page: Number(page),
          limit: Number(limit),
        },
        {
          order: [['createdAt', 'DESC']],
          where: { topicId },
          include: [
            {
              model: Reply,
              include: [
                {
                  model: Reply,
                  as: 'childReplies',
                  include: [{ model: Reply, as: 'childReplies' }],
                },
              ],
            },
            {
              model: Reaction,
            },
          ],
        }
      )

      res.status(200).json(paginatedComments)
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

      const comment = await Comment.findByPk(id, {
        include: [
          {
            model: Reply,
            include: [
              {
                model: Reply,
                as: 'childReplies',
                include: [{ model: Reply, as: 'childReplies' }],
              },
            ],
          },
          {
            model: Reaction,
          },
        ],
      })

      if (!comment) {
        return next(ApiError.notFound('Comment not found'))
      }

      res.status(200).json(comment)
    } catch (e) {
      next(ApiError.badRequest('Failed to get comment', e))
    }
  }

  static async deleteById(
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

      await comment.destroy()

      res.status(200).json({ message: 'Comment deleted' })
    } catch (e) {
      next(ApiError.badRequest('Failed to delete comment', e))
    }
  }

  static async updateById(
    req: Request<
      { id: string },
      unknown,
      Omit<CommentCreateRequest, 'topicId'>
    >,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const comment = await Comment.findByPk(id)

      if (!comment) {
        return next(ApiError.notFound('Comment not found'))
      }

      await comment.update(req.body)

      res.status(200).json(comment)
    } catch (e) {
      next(ApiError.badRequest('Failed to get comment', e))
    }
  }
}
