import type { Model } from 'sequelize-typescript'
import { type FindAndCountOptions, type ModelStatic, Op } from 'sequelize'

export interface PaginationParams {
  page?: number
  limit?: number
  [key: string]: any
}

export interface PaginationResult<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pageCount: number
    limit: number
  }
}

export async function paginateAndSearch<T extends Model>(
  model: ModelStatic<T>,
  params: PaginationParams = {},
  options: FindAndCountOptions = {}
): Promise<PaginationResult<T>> {
  const page = Math.max(1, Number(params.page) || 1)
  const limit = Math.max(1, Number(params.limit) || 10)
  const offset = (page - 1) * limit

  const dynamicWhere: any = {}
  for (const key in params) {
    if (['page', 'limit'].includes(key)) continue
    const value = params[key]
    if (value != null && value !== '') {
      dynamicWhere[key] =
        typeof value === 'string' ? { [Op.iLike]: `%${value}%` } : value
    }
  }

  const { count, rows } = await model.findAndCountAll({
    ...options,
    where: {
      ...dynamicWhere,
      ...options.where,
    },
    limit,
    offset,
  })

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      pageCount: Math.ceil(count / limit),
      limit,
    },
  }
}
