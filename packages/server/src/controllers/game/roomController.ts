import type { NextFunction, Request, Response } from 'express'
import CellController from './cellController'
import Room from '../../models/game/Room'
import PlayerController from './playerController'
import ItemController from './itemController'
import ZombieController from './zombieController'
import UserController from '../user/userController'
import Wss from '../../ws'
import Cell from '../../models/game/Cell'
import Player from '../../models/game/Player'
import Item from '../../models/game/Item'
import Zombie from '../../models/game/Zombie'

export default class RoomController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController.get(req, next)
      const room = await Room.create({ hostId: user.id })

      res.status(201).json({ id: room.id })
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: 'Failed to create room', details: e })
    }
  }

  static async update(
    req: Request<{ id: string }, unknown, any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req, next)
      const { id } = req.params

      const { players, board, items, zombies } = req.body

      const room = await Room.findByPk(id)

      if (!room) {
        res.status(404).json({ message: 'Room not found' })
        return
      }

      await room.update(req.body)

      await CellController.createAll(room.id, board.cells)
      await ItemController.createAll(room.id, items)
      await PlayerController.createAll(room.id, players)
      await ZombieController.createAll(room.id, zombies)

      Wss.sendToRoom(room.id, { type: 'updated', room: room.id }, user.id)

      res.status(201).json({ message: 'ok' })
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: 'Failed to create room', details: e })
    }
  }

  static async get(req: Request<{ id: string }, unknown, any>, res: Response) {
    try {
      const { id } = req.params

      const room = await Room.findByPk(id, {
        include: [Cell, { model: Player, include: [Item] }, Item, Zombie],
      })

      if (!room) {
        res.status(404).json({ message: 'Room not found' })
        return
      }

      const roomValues = room.dataValues

      const size = 12

      const grid: Cell[][] = Array.from({ length: size }, () =>
        Array(size).fill(null)
      )

      for (const cell of roomValues.cells) {
        grid[cell.x][cell.y] = cell
      }

      roomValues.board = {}
      roomValues.board.cells = grid
      delete roomValues.cells

      res.status(200).json(roomValues)
    } catch (e) {
      res.status(500).json({ error: 'Failed to get room', details: e })
    }
  }
}
