import type { NextFunction, Request, Response } from 'express'
import Topic from '../../models/forum/Topic'
import Comment from '../../models/forum/Comment'
import Reply from '../../models/forum/Reply'
import Reaction from '../../models/forum/Reaction'
import ApiError from '../../error/ApiError'
import { paginateAndSearch } from '../../helpers/paginationAndSearch'
import ForumController from './forumController'

export type TopicCreateRequest = {
  title: string
  description: string
}

export default class TopicController extends ForumController {
  static async create(
    req: Request<unknown, unknown, TopicCreateRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await ForumController.add(Topic, req, res, next)
  }

  static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const paginatedTopics = await paginateAndSearch(Topic, req.query, {
        order: [['createdAt', 'DESC']],
      })

      res.status(200).json(paginatedTopics)
    } catch (e) {
      next(ApiError.badRequest('Failed to get all topics', e))
    }
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const options = {
      include: [
        {
          model: Comment,
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
            { model: Reaction },
          ],
        },
      ],
    }
    await ForumController.findById(Topic, req, res, next, options)
  }

  static async deleteById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await ForumController.removeById(Topic, req, res, next)
  }

  static async updateById(
    req: Request<{ id: string }, unknown, TopicCreateRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await ForumController.changeById(Topic, req, res, next)
  }
}
