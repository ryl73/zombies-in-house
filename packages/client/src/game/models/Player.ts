import { createItem, Item } from './Item'

export type PlayerType = 'sasha' | 'nastya' | 'max' | 'nadya' | 'boris'

export type Player = {
  cellId: number | null
  name: string
  image: string
  lifeCount: number
  items: Item[]
  type: PlayerType
  id: number
  isZombie: boolean
}

export type PlayerProps = {
  cellId: number
  lifeCount: number
  name: string
  type: PlayerType
}

export function createPlayer({
  cellId,
  lifeCount,
  name,
  type,
}: PlayerProps): Player {
  const player = {
    cellId,
    lifeCount,
    name,
    image: `/images/game/cards/characters/${type}.png`,
    type,
    items: [],
    id: Math.random(),
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
