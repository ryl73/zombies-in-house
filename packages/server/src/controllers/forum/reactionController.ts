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
    await this.add(Reaction, req, res, next)
  }

  static async getByCommentId(
    req: Request<{ commentId: string }>,
    res: Response,
    next: NextFunction
  ) {
    await this.getByField(Reaction, 'commentId', req, res, next)
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    await this.findById(Reaction, req, res, next)
  }

  static async deleteById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await this.removeById(Reaction, req, res, next)
  }
}
