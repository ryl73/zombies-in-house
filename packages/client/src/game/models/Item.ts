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
  cellId?: number | null
  name: string
  type: ItemType
}

export type Item = {
  cellId: number | null
  name: string
  image: string
  opened: boolean
  id: number
  type: ItemType
}

export function createItem({ name, type, cellId = null }: ItemProps): Item {
  return {
    cellId,
    name,
    image: `/images/game/cards/items/${name}.png`,
    type,
    opened: false,
    id: Math.random(),
  }
}

export function getItemById(items: Item[], itemId: number): Item | undefined {
  return items.find(item => item.id === itemId)
}
