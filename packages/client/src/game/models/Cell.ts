import { Item } from './Item'
import { Player } from './Player'
import Zombie from './Zombie'

export type CellType = 'car' | 'plankPlace'

export class Cell {
  x: number
  y: number
  available: boolean
  canMove: boolean
  empty: boolean
  items: Item[] = []
  players: Player[] = []
  zombie: Zombie | null = null
  id: number
  type?: CellType
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean }

  constructor(x: number, y: number, available: boolean) {
    this.x = x
    this.y = y
    this.available = available
    this.canMove = false
    this.empty = true
    this.id = Math.random()
    this.walls = {
      top: false,
      right: false,
      bottom: false,
      left: false,
    }
  }

  addItem(item: Item) {
    if (!this.items.includes(item)) {
      this.items.push(item)
      item.cell = this
      this.empty = false
    }
  }

  removeAllItems() {
    this.items = []
  }

  addPlayer(player: Player) {
    if (!this.players.includes(player)) {
      this.players.push(player)
      player.cell = this
      this.empty = false
    }
  }

  addZombie(zombie: Zombie) {
    if (!this.zombie) {
      this.zombie = zombie
      zombie.cell = this
      this.empty = false
    }
  }

  removeZombie() {
    this.zombie = null
  }

  removePlayer(player: Player) {
    this.players = this.players.filter(p => p !== player)
  }

  movePlayer(player: Player, target: Cell) {
    if (!this.players.includes(player)) return // игрок должен быть в этой клетке
    this.removePlayer(player)
    target.addPlayer(player)
  }

  setWalls(top: boolean, right: boolean, bottom: boolean, left: boolean) {
    this.walls.top = top
    this.walls.right = right
    this.walls.bottom = bottom
    this.walls.left = left
  }

  setType(type: CellType) {
    this.type = type
  }
}
