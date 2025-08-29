export type ZombieType = 'ordinary' | 'dog' | 'spider' | 'boss'

type ZombieProps = {
  cellId: number
  type: ZombieType
  image: string
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

export function createZombie({
  cellId,
  type,
  image,
  name,
}: ZombieProps): Zombie {
  return {
    cellId,
    type,
    image,
    name,
    id: Math.random(),
    opened: false,
  }
}
