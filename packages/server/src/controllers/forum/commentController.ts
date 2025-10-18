import type { NextFunction, Request, Response } from 'express'
import Comment from '../../models/forum/Comment'
import ApiError from '../../error/ApiError'
import Reply from '../../models/forum/Reply'
import Reaction from '../../models/forum/Reaction'
import { paginateAndSearch } from '../../helpers/paginationAndSearch'
import ForumController from './forumController'

export type CommentCreateRequest = {
  topicId: string
  message: string
}

export default class CommentController extends ForumController {
  static async create(
    req: Request<unknown, unknown, CommentCreateRequest>,
    res: Response,
    next: NextFunction
  ) {
    await this.add<Comment>(Comment, req, res, next)
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
    const options = {
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
    await this.findById(Comment, req, res, next, options)
  }

  static async deleteById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await this.removeById(Comment, req, res, next)
  }

  static async updateById(
    req: Request<{ id: string }, unknown, CommentCreateRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await this.changeById(Comment, req, res, next)
  }
}
