import type { NextFunction, Request, Response } from 'express'
import ApiError from '../../error/ApiError'
import type { FindOptions, ModelStatic } from 'sequelize'
import type { Model } from 'sequelize-typescript'
import UserController from '../user/userController'

type WithAuthorLogin = { authorLogin: string }

export default class ForumController {
  static async add<T extends Model>(
    model: ModelStatic<T>,
    req: Request<unknown, unknown, T['_creationAttributes']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req, next)
      const result = await model.create({
        ...req.body,
        authorLogin: user.login,
        authorAvatar: user.avatar,
      })

      res.status(201).json({ id: result.id })
    } catch (e) {
      next(ApiError.badRequest('Failed to create', e))
    }
  }

  static async findById<T extends Model>(
    model: ModelStatic<T>,
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
    options: FindOptions = {}
  ) {
    try {
      const { id } = req.params

      const result = await model.findByPk(id, options)

      if (!result) {
        return next(ApiError.badRequest('Not found'))
      }

      res.status(200).json(result)
    } catch (e) {
      next(ApiError.badRequest('Failed to get', e))
    }
  }

  static async removeById<
    T extends Model<WithAuthorLogin> & { authorLogin: string }
  >(
    model: ModelStatic<T>,
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req, next)
      const { id } = req.params

      const result = await model.findByPk(id)

      if (!result) {
        return next(ApiError.notFound('Not found'))
      }

      if (user.login !== result.authorLogin) {
        return next(ApiError.forbidden('You are not permitted to delete this'))
      }

      await result.destroy()

      res.status(200).json({ message: 'Deleted' })
    } catch (e) {
      next(ApiError.badRequest('Failed to delete', e))
    }
  }

  static async changeById<
    T extends Model<WithAuthorLogin> & { authorLogin: string }
  >(
    model: ModelStatic<T>,
    req: Request<{ id: string }, unknown, T['_creationAttributes']>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req, next)
      const { id } = req.params

      const result = await model.findByPk(id)

      if (!result) {
        return next(ApiError.notFound('Not found'))
      }

      if (user.login !== result.authorLogin) {
        return next(ApiError.forbidden('You are not permitted to update this'))
      }

      await result.update(req.body)

      res.status(200).json(result)
    } catch (e) {
      next(ApiError.badRequest('Failed to update', e))
    }
  }

  static async getByField<
    T extends Model,
    K extends keyof T['_attributes'] & string
  >(
    model: ModelStatic<T>,
    fieldName: K,
    req: Request<Record<K, string>>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const value = req.params[fieldName]

      if (value === undefined) {
        return next(ApiError.badRequest(`Missing param: ${fieldName}`))
      }

      const result = await model.findAll({
        where: { [fieldName]: value } as any,
      })

      res.status(200).json(result)
    } catch (e) {
      next(ApiError.badRequest(`Failed to get all by ${fieldName}`, e))
    }
  }
}
