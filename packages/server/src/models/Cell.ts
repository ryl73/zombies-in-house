import type { ModelAttributes } from 'sequelize'
import { DataType, type Model } from 'sequelize-typescript'

export type CellType = 'car' | 'plankPlace' | 'start'

export type Cell = {
  id: string
  roomId: string
  x: number
  y: number
  isTraversable: boolean
  isEmpty: boolean
  type?: CellType
  hasBarricade: boolean
  availableBarricadeDirections: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
  installedBarricadeDirections: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
  walls: {
    top: boolean
    right: boolean
    left: boolean
    bottom: boolean
  }
}

export const cellModel: ModelAttributes<Model, Cell> = {
  id: {
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  },
  roomId: {
    type: DataType.UUID,
    allowNull: false,
  },
  x: DataType.INTEGER,
  y: DataType.INTEGER,
  isTraversable: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
  isEmpty: {
    type: DataType.BOOLEAN,
    defaultValue: true,
  },
  type: DataType.ENUM('car', 'plankPlace', 'start'),
  hasBarricade: {
    type: DataType.BOOLEAN,
    defaultValue: false,
  },
  availableBarricadeDirections: DataType.JSONB,
  installedBarricadeDirections: DataType.JSONB,
  walls: DataType.JSONB,
}
