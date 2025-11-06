import Cell from '../../models/game/Cell'

export default class CellController {
  static async createAll(roomId: string, cells: Cell[][]) {
    for (const cell of cells.flat()) {
      await Cell.upsert({ ...cell, roomId })
    }
  }

  static async getAll(roomId: string) {
    const roomCells = await Cell.findAll({
      where: { roomId },
      attributes: { exclude: ['roomId'] },
    })

    const result = []

    for (let i = 0; i < roomCells.length; i += 12) {
      result.push(roomCells.slice(i, i + 12))
    }

    return result
  }
}
