export type CellType = 'car' | 'plankPlace' | 'start'

export type Cell = {
  id: number
  x: number
  y: number
  available: boolean
  canMove: boolean
  empty: boolean
  type?: CellType
  walls: {
    top: boolean
    right: boolean
    left: boolean
    bottom: boolean
  }
}

export function createCell(x: number, y: number, available: boolean): Cell {
  return {
    x,
    y,
    available,
    canMove: false,
    empty: true,
    id: Math.random(),
    walls: {
      top: false,
      right: false,
      bottom: false,
      left: false,
    },
  }
}

export function setCellWalls(
  cell: Cell,
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean
): Cell {
  return {
    ...cell,
    walls: { top, right, bottom, left },
  }
}
