import type { Request, Response } from 'express'
import CellController from './cellController'
import Room from '../../models/game/Room'
import PlayerController from './playerController'
import ItemController from './itemController'
import ZombieController from './zombieController'

export default class RoomController {
  static async create(
    req: Request<unknown, unknown, { hostId: number }>,
    res: Response
  ) {
    try {
      const { hostId } = req.body

      const room = await Room.create({ hostId })

      res.status(201).json({ id: room.id })
    } catch (e) {
      res.status(500).json({ error: 'Failed to create room', details: e })
    }
  }

  static async update(
    req: Request<{ id: string }, unknown, any>,
    res: Response
  ) {
    try {
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

      res.status(201).json({ message: 'ok' })
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: 'Failed to create room', details: e })
    }
  }

  static async get(req: Request<{ id: string }, unknown, any>, res: Response) {
    try {
      const { id } = req.params

      const room = await Room.findByPk(id)

      if (!room) {
        res.status(404).json({ message: 'Room not found' })
        return
      }

      room.barricadeSelection = JSON.parse(room.barricadeSelection)

      const result = { ...room, board: { cells: {} } }

      const roomCells = await CellController.getAll(room.id)
      const roomItems = await ItemController.getAll(room.id)
      const roomPlayers = await PlayerController.getAll(room.id)
      const roomZombies = await ZombieController.getAll(room.id)

      result.board.cells = roomCells
      result.items = roomItems
      result.players = roomPlayers
      result.zombies = roomZombies

      res.status(201).json({ message: 'ok' })
    } catch (e) {
      res.status(500).json({ error: 'Failed to create room', details: e })
    }
  }
}
