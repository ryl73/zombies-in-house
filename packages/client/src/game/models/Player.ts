import { createItem, Item } from './Item'
import { v4 as uuidv4 } from 'uuid'

export type PlayerType = 'sasha' | 'nastya' | 'max' | 'nadya' | 'boris'

export type Player = {
  cellId: string | null
  name: string
  image: string
  lifeCount: number
  items: Item[]
  type: PlayerType
  id: string
  isZombie: boolean
  userId: number | null
}

export type PlayerProps = {
  cellId: string
  lifeCount: number
  name: string
  userId?: number | null
  type: PlayerType
}

export function createPlayer({
  cellId,
  lifeCount,
  name,
  type,
  userId = null,
}: PlayerProps): Player {
  const player = {
    cellId,
    lifeCount,
    name,
    userId,
    image: `/images/game/cards/characters/${type}.png`,
    type,
    items: [],
    id: uuidv4(),
    isZombie: false,
  }

  return setPlayerSpecialties(player)
}

export function pickPlayerItem(player: Player, item: Item): Player {
  return {
    ...player,
    items: player.items.includes(item) ? player.items : [...player.items, item],
  }
}

function setPlayerSpecialties(player: Player): Player {
  switch (player.type) {
    case 'sasha': {
      const knife = createItem({
        type: 'coldWeapon',
        name: 'knife',
      })
      return pickPlayerItem(player, knife)
    }

    case 'nadya': {
      const handgun = createItem({
        type: 'gunWeapon',
        name: 'handgun',
      })
      return pickPlayerItem(player, handgun)
    }
  }
  return player
}
