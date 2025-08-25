import { Cell } from './Cell'

/*
  1 - top wall
  2 - right wall
  4 - bottom wall
  8 - left wall
 */

const boardWallsMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 9, 3, 9, 0, 3, 9, 1, 1, 3, 0],
  [0, 0, 0, 2, 8, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 12, 4, 0, 4, 6, 12, 4, 0, 6, 0],
  [0, 0, 9, 1, 0, 1, 3, 9, 1, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 8, 0, 0, 0, 2, 8, 0, 0, 2, 0],
  [0, 0, 12, 4, 0, 0, 6, 12, 4, 4, 6, 0],
  [0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

export class Board {
  cells: Cell[][] = []

  public initialCells() {
    for (let i = 0; i < boardWallsMatrix.length; i++) {
      const row: Cell[] = []
      for (let j = 0; j < boardWallsMatrix[0].length; j++) {
        const value = boardWallsMatrix[i][j]
        const cell = new Cell(i, j, true)
        if (i === 1 && (j === 10 || j === 9 || j === 8)) {
          cell.setType('car')
        }
        cell.setWalls(
          (value & 1) !== 0,
          (value & 2) !== 0,
          (value & 4) !== 0,
          (value & 8) !== 0
        )
        row.push(cell)
      }
      this.cells.push(row)
    }
  }

  getCell(x: number, y: number): Cell {
    return this.cells[x][y]
  }

  addWall(
    x: number,
    y: number,
    direction: 'top' | 'bottom' | 'left' | 'right'
  ) {
    const cell = this.getCell(x, y)
    if (!cell) return

    cell.walls[direction] = true

    // mirror wall on neighbor
    const dx = { left: -1, right: 1, top: 0, bottom: 0 }
    const dy = { top: -1, bottom: 1, left: 0, right: 0 }
    const opposite: Record<typeof direction, typeof direction> = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left',
    }

    const neighbor = this.getCell(x + dx[direction], y + dy[direction])
    if (neighbor) neighbor.walls[opposite[direction]] = true
  }
}
