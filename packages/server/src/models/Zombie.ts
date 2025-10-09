import type { ModelAttributes } from 'sequelize'
import { DataType, type Model } from 'sequelize-typescript'

export type ZombieType = 'ordinary' | 'dog' | 'spider' | 'boss'

export type Zombie = {
  id: string
  roomId: string
  cellId: number | null
  name: string
  type: ZombieType
  opened: boolean
}

export const zombieModel: ModelAttributes<Model, Zombie> = {
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
  type: DataType.ENUM('sasha', 'nastya', 'max', 'nadya', 'boris'),
  opened: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
}
