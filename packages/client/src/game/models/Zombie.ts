import { Cell } from './Cell'

export type ZombieType = 'ordinary' | 'dog' | 'spider' | 'boss'

type ZombieProps = {
  cell: Cell
  type: ZombieType
  image: string
  name: string
}

export default class Zombie {
  cell: Cell
  type: ZombieType
  id: number
  name: string
  image: string
  opened: boolean

  constructor({ cell, type, image, name }: ZombieProps) {
    this.cell = cell
    this.type = type
    this.id = Math.random()
    this.name = name
    this.image = image
    this.opened = false
  }
}
