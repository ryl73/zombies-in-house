export type CellType = 'car' | 'plankPlace' | 'start'

export type Cell = {
  id: number
  x: number
  y: number
  isTraversable: boolean
  isEmpty: boolean
  type?: CellType
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
    id: Math.random(),
    walls: {
      top: false,
      right: false,
      bottom: false,
      left: false,
    },
  }
}
