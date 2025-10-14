export type CellType = 'car' | 'plankPlace' | 'start'
import { v4 as uuidv4 } from 'uuid'

export type Cell = {
  id: string
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

export function createCell(x: number, y: number): Cell {
  return {
    x,
    y,
    isTraversable: false,
    isEmpty: true,
    hasBarricade: false,
    availableBarricadeDirections: {
      top: false,
      right: false,
      bottom: false,
      left: false,
    },
    installedBarricadeDirections: {
      top: false,
      right: false,
      bottom: false,
      left: false,
    },
    id: uuidv4(),
    walls: {
      top: false,
      right: false,
      bottom: false,
      left: false,
    },
  }
}
