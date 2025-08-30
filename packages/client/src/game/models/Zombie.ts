export type ZombieType = 'ordinary' | 'dog' | 'spider' | 'boss'

type ZombieProps = {
  cellId: number
  type: ZombieType
  name: string
}

export type Zombie = {
  cellId: number | null
  type: ZombieType
  id: number
  name: string
  image: string
  opened: boolean
}

export function createZombie({ cellId, type, name }: ZombieProps): Zombie {
  return {
    cellId,
    type,
    image: `/images/game/cards/zombies/${type}.png`,
    name,
    id: Math.random(),
    opened: false,
  }
}
