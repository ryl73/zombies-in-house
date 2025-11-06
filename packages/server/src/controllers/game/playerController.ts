import Player from '../../models/game/Player'
import Item from '../../models/game/Item'

export default class PlayerController {
  static async createAll(roomId: string, players: Player[]) {
    for (const player of players) {
      await Player.upsert({ ...player, roomId })
      for (const item of player.items) {
        const playerItem = await Item.findByPk(item.id)
        if (!playerItem) {
          return
        }
        await playerItem.update({ ownerId: player.id })
      }
    }
  }

  static async getAll(roomId: string) {
    return await Player.findAll({
      where: { roomId },
      attributes: { exclude: ['roomId'] },
    })
  }
}
