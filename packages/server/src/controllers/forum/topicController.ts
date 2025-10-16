import type { NextFunction, Request, Response } from 'express'
import Topic from '../../models/forum/Topic'
import Comment from '../../models/forum/Comment'
import Reply from '../../models/forum/Reply'
import Reaction from '../../models/forum/Reaction'
import ApiError from '../../error/ApiError'
import UserController from '../user/userController'
import type { RequestWithCookie } from '../../middleware/AuthMiddleware'

export type TopicCreateRequest = {
  title: string
  description: string
}

export default class TopicController {
  static async create(
    req: RequestWithCookie<unknown, unknown, TopicCreateRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await UserController.get(req)
      const { title, description } = req.body

      const topic = await Topic.create({
        authorLogin: user.login,
        authorAvatar: user.avatar,
        title,
        description,
      })

      res.status(201).json({ id: topic.id })
    } catch (e) {
      next(ApiError.badRequest('Failed to create topic', e))
    }
  }

  static async getAll(
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const topics = await Topic.findAll()

      res.status(200).json(topics)
    } catch (e) {
      next(ApiError.badRequest('Failed to get all topics', e))
    }
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params

      const topic = await Topic.findByPk(id, {
        include: [
          {
            model: Comment,
            include: [{ model: Reply }, { model: Reaction }],
          },
        ],
      })

      if (!topic) {
        return next(ApiError.notFound('Topic not found'))
      }

      res.status(200).json(topic)
    } catch (e) {
      next(ApiError.badRequest('Failed to get topic', e))
    }
  }
}
