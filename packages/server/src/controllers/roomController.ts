import type { Request, Response } from 'express'
import { Player, Room } from '../models'
import type { Room as RoomType } from '../models/Room'

export default class RoomController {
  static async create(req: Request<unknown, unknown, any>, res: Response) {
    try {
      const { hostId, state } = req.body

      const stateObj: Partial<RoomType> = {
        turn: state.turn,
        currentPlayerIndex: state.currentPlayerIndex,
        canFight: state.canFight,
        canSkipTurn: state.canSkipTurn,
        isAwaitingBarricadeDirection: state.isAwaitingBarricadeDirection,
        barricadeSelection: JSON.stringify(state.barricadeSelection),
        isProcessing: state.isProcessing,
        status: state.status,
        isZombieMove: state.isZombieMove,
      }

      const room = await Room.create({ hostId, ...stateObj })

      await Player.bulkCreate(state.players, { validate: true })

      res.status(201).json({ id: room.id })
    } catch (e) {
      res.status(500).json({ error: 'Failed to create room', details: e })
    }
  }
}
