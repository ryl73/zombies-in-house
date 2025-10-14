import Item from '../../models/game/Item'

export default class ItemController {
  static async createAll(roomId: string, items: Item[]) {
    for (const item of items) {
      await Item.create({ ...item, roomId })
    }
  }

  static async getAll(roomId: string) {
    return await Item.findAll({
      where: { roomId },
      attributes: { exclude: ['roomId'] },
    })
  }
}
