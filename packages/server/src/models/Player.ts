import type { ModelAttributes } from 'sequelize'
import { DataType, type Model } from 'sequelize-typescript'

export type PlayerType = 'sasha' | 'nastya' | 'max' | 'nadya' | 'boris'

export type Player = {
  id: string
  roomId: string
  userId: string
  cellId: number | null
  name: string
  lifeCount: number
  type: PlayerType
  isZombie: boolean
}

export const playerModel: ModelAttributes<Model, Player> = {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  },
  roomId: {
    type: DataType.UUID,
    allowNull: false,
  },
  userId: {
    type: DataType.STRING,
    allowNull: false,
  },
  cellId: DataType.UUID,
  name: DataType.STRING,
  lifeCount: {
    type: DataType.INTEGER,
    defaultValue: 3,
  },
  type: DataType.ENUM('sasha', 'nastya', 'max', 'nadya', 'boris'),
  isZombie: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
}
