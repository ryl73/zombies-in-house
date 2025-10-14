import { v4 as uuidv4 } from 'uuid'

export type ZombieType = 'ordinary' | 'dog' | 'spider' | 'boss'

type ZombieProps = {
  cellId: string
  type: ZombieType
  name: string
}

export type Zombie = {
  cellId: string | null
  type: ZombieType
  id: string
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
    id: uuidv4(),
    opened: false,
  }
}
