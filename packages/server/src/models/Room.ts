import type { ModelAttributes } from 'sequelize'
import { DataType, type Model } from 'sequelize-typescript'

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'
export type CanFightType =
  | 'coldWeapon'
  | 'gunWeapon'
  | 'grenade'
  | 'launcher'
  | null

export type Room = {
  id: string
  hostId: number
  turn: number
  currentPlayerIndex: number
  canFight: CanFightType
  status: GameStatus
  isZombieMove: boolean
  isProcessing: boolean
  barricadeSelection: string
  isAwaitingBarricadeDirection: boolean
  canSkipTurn: boolean
}

export const roomModel: ModelAttributes<Model, Room> = {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  },
  hostId: {
    type: DataType.INTEGER,
    allowNull: false,
  },
  turn: DataType.INTEGER,
  currentPlayerIndex: DataType.INTEGER,
  canFight: DataType.ENUM('coldWeapon', 'gunWeapon', 'grenade', 'launcher'),
  status: DataType.ENUM('idle', 'playing', 'won', 'lost'),
  isZombieMove: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
  isProcessing: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
  barricadeSelection: DataType.JSONB,
  isAwaitingBarricadeDirection: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
  canSkipTurn: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
}
