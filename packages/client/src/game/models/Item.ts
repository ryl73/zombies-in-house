import { v4 as uuidv4 } from 'uuid'

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
  cellId?: string | null
  name: string
  type: ItemType
}

export type Item = {
  cellId: string | null
  name: string
  image: string
  opened: boolean
  id: string
  type: ItemType
}

export function createItem({ name, type, cellId = null }: ItemProps): Item {
  return {
    cellId,
    name,
    image: `/images/game/cards/items/${name}.png`,
    type,
    opened: false,
    id: uuidv4(),
  }
}
