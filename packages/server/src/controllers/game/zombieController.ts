import Zombie from '../../models/game/Zombie'

export default class ZombieController {
  static async createAll(roomId: string, zombies: Zombie[]) {
    for (const zombie of zombies) {
      await Zombie.create({ ...zombie, roomId })
    }
  }

  static async getAll(roomId: string) {
    return await Zombie.findAll({
      where: { roomId },
      attributes: { exclude: ['roomId'] },
    })
  }
}
