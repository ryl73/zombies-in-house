import Cell from '../../models/game/Cell'

export default class CellController {
  static async createAll(roomId: string, cells: Cell[][]) {
    for (const cell of cells.flat()) {
      await Cell.create({ ...cell, roomId })
    }
  }

  static async getAll(roomId: string) {
    const roomCells = await Cell.findAll({
      where: { roomId },
      attributes: { exclude: ['roomId'] },
    })

    roomCells.forEach(cell => {
      cell.availableBarricadeDirections = JSON.parse(
        cell.availableBarricadeDirections
      )
      cell.installedBarricadeDirections = JSON.parse(
        cell.installedBarricadeDirections
      )
      cell.walls = JSON.parse(cell.walls)
    })

    const result = []

    for (let i = 0; i < roomCells.length; i += 12) {
      result.push(roomCells.slice(i, i + 12))
    }

    return result
  }
}
