import { Cell } from './Cell'
import { Player } from './Player'
import Game from '../engine/Game'
import { store } from '../../store'
import { forceUpdate } from '../../slices/gameSlice'

export type ItemType =
  | 'coldWeapon'
  | 'gunWeapon'
  | 'grenade'
  | 'launcher'
  | 'medkit'
  | 'plank'
  | 'key'
  | 'gasoline'

export type ItemProps = {
  cell?: Cell
  name: string
  image: string
  type: ItemType
  ownerId?: number | null
}

export class Item {
  cell?: Cell
  name: string
  image: string
  opened: boolean
  id: number
  ownerId: number | null
  type: ItemType

  constructor({ image, name, cell, type, ownerId = null }: ItemProps) {
    this.name = name
    this.image = image
    this.opened = false
    this.id = Math.random()
    this.ownerId = ownerId
    this.cell = cell
    this.type = type
  }

  use(game: Game, player: Player) {
    switch (this.type) {
      case 'medkit': {
        player.useItem(this)
        if (player.type === 'nastya') {
          player.lifeCount += 2
          break
        }
        player.lifeCount++
        break
      }
      case 'grenade': {
        if (player.cell?.zombie) {
          game.winFight(player)
          player.useItem(this)
        }
        break
      }
      case 'coldWeapon': {
        if (player.cell?.zombie) {
          game.winFight(player)
        }
        break
      }
      case 'gunWeapon': {
        if (player.cell?.zombie) {
          game.winFight(player)
        }
        break
      }
      case 'plank': {
        if (player.cell?.type === 'plankPlace') {
          player.cell.addItem(this)
          this.cell = player.cell
          player.useItem(this)
        }
        break
      }
    }
    store.dispatch(forceUpdate())
  }
}
