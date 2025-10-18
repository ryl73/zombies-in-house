import type { NextFunction, Request, Response } from 'express'
import Reaction from '../../models/forum/Reaction'
import ForumController from './forumController'

export type ReactionCreateRequest = {
  commentId: string
  code: string
}

export default class ReactionController extends ForumController {
  static async create(
    req: Request<unknown, unknown, ReactionCreateRequest>,
    res: Response,
    next: NextFunction
  ) {
    await ForumController.add(Reaction, req, res, next)
  }

  static async getByCommentId(
    req: Request<{ commentId: string }>,
    res: Response,
    next: NextFunction
  ) {
    await ForumController.getByField(Reaction, 'commentId', req, res, next)
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    await ForumController.findById(Reaction, req, res, next)
  }

  static async deleteById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await ForumController.removeById(Reaction, req, res, next)
  }
}
