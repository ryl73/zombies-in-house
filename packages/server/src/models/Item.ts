import type { ModelAttributes } from 'sequelize'
import { DataType, type Model } from 'sequelize-typescript'

export type ItemType =
  | 'coldWeapon'
  | 'gunWeapon'
  | 'grenade'
  | 'launcher'
  | 'medkit'
  | 'plank'
  | 'key'
  | 'gasoline'

export type Item = {
  id: string
  roomId: string
  cellId: string | null
  name: string
  opened: boolean
  type: ItemType
}

export const itemModel: ModelAttributes<Model, Item> = {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  },
  roomId: {
    type: DataType.UUID,
    allowNull: false,
  },
  cellId: DataType.UUID,
  name: DataType.STRING,
  type: DataType.ENUM(
    'coldWeapon',
    'gunWeapon',
    'grenade',
    'launcher',
    'medkit',
    'plank',
    'key',
    'gasoline'
  ),
  opened: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
}
