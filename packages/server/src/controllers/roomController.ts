import type { Request, Response } from 'express'
import { Room } from '../models'
import type { Room as RoomType } from '../models/Room'

export default class RoomController {
  static async create(req: Request<unknown, unknown, RoomType>, res: Response) {
    try {
      await Room.create(req.body)

      res.status(201).json({ status: 'ok' })
    } catch (e) {
      res.status(500).json({ error: 'Failed to create room', details: e })
    }
  }
}
