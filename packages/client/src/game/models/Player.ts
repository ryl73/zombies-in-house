import { Item } from './Item'
import { Cell } from './Cell'

export type PlayerType = 'sasha' | 'nastya' | 'max' | 'nadya' | 'boris'

export type PlayerProps = {
  cell: Cell | null
  name: string
  image: string
  lifeCount: number
  items?: Item[]
  type: PlayerType
}

export class Player {
  cell: Cell | null
  lifeCount: number
  name: string
  image: string
  id: number
  isZombie: boolean
  type: PlayerType
  items: Item[] = []

  constructor({ cell, lifeCount, name, image, type }: PlayerProps) {
    this.cell = cell
    this.lifeCount = lifeCount
    this.name = name
    this.id = Math.random()
    this.image = image
    this.isZombie = false
    this.type = type
    this.setSpecialties()
  }

  pickItem(item: Item) {
    this.items.push(item)
    item.ownerId = this.id
  }

  useItem(itemToUse: Item) {
    this.items = this.items.filter(item => item.id !== itemToUse.id)
  }

  setSpecialties() {
    switch (this.type) {
      case 'sasha': {
        const knife = new Item({
          image: '',
          type: 'coldWeapon',
          name: 'knife',
        })
        this.pickItem(knife)
        break
      }

      case 'nadya': {
        const handgun = new Item({
          image: '',
          type: 'gunWeapon',
          name: 'handgun',
        })
        this.pickItem(handgun)
        break
      }
    }
  }
}
