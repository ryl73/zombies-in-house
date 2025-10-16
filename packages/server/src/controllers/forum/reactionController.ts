import type { NextFunction, Request, Response } from 'express'
import Reaction from '../../models/forum/Reaction'
import ApiError from '../../error/ApiError'
import UserController from '../user/userController'
import type { RequestWithCookie } from '../../middleware/AuthMiddleware'

export type ReactionCreateRequest = {
  commentId: string
  code: string
}

export default class ReactionController {
  static async create(
    req: RequestWithCookie<unknown, unknown, ReactionCreateRequest>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req)
      const { commentId, code } = req.body

      const reaction = await Reaction.create({
        authorLogin: user.login,
        commentId,
        code,
      })

      res.status(201).json({ id: reaction.id })
    } catch (e) {
      next(ApiError.badRequest('Failed to create reaction', e))
    }
  }

  static async getByCommentId(
    req: Request<{ commentId: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { commentId } = req.params

      const commentReactions = await Reaction.findAll({ where: { commentId } })

      res.status(200).json(commentReactions)
    } catch (e) {
      next(ApiError.badRequest('Failed to get all reactions', e))
    }
  }

  static async getById(
    req: Request<{ id: string }, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params

      const reaction = await Reaction.findByPk(id)

      if (!reaction) {
        return next(ApiError.badRequest('Reaction not found'))
      }

      res.status(200).json(reaction)
    } catch (e) {
      next(ApiError.badRequest('Failed to get reaction', e))
    }
  }
}
