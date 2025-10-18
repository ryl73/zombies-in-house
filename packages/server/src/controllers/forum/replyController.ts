import type { NextFunction, Request, Response } from 'express'
import Reply from '../../models/forum/Reply'
import ForumController from './forumController'

export type ReplyCreateRequest = {
  message: string
  commentId: string
  parentReplyId?: string
}

export default class ReplyController extends ForumController {
  static async create(
    req: Request<unknown, unknown, ReplyCreateRequest>,
    res: Response,
    next: NextFunction
  ) {
    await this.add(Reply, req, res, next)
  }

  static async getByCommentId(
    req: Request<{ commentId: string }>,
    res: Response,
    next: NextFunction
  ) {
    await this.getByField(Reply, 'commentId', req, res, next)
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    await this.findById(Reply, req, res, next)
  }

  static async deleteById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await this.removeById(Reply, req, res, next)
  }

  static async updateById(
    req: Request<{ id: string }, unknown, ReplyCreateRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await this.changeById(Reply, req, res, next)
  }
}
