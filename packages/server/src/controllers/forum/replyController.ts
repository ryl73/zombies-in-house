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
    await ForumController.add(Reply, req, res, next)
  }

  static async getByCommentId(
    req: Request<{ commentId: string }>,
    res: Response,
    next: NextFunction
  ) {
    await ForumController.getByField(Reply, 'commentId', req, res, next)
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    await ForumController.findById(Reply, req, res, next)
  }

  static async deleteById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await ForumController.removeById(Reply, req, res, next)
  }

  static async updateById(
    req: Request<{ id: string }, unknown, ReplyCreateRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    await ForumController.changeById(Reply, req, res, next)
  }
}
