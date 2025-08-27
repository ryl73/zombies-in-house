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
  [0, 0, 4, 4, 4, 0, 4, 4, 4, 4, 4, 8],
  [0, 2, 9, 3, 9, 0, 3, 9, 1, 1, 3, 0],
  [0, 0, 0, 2, 8, 0, 0, 0, 0, 0, 0, 8],
  [0, 2, 12, 4, 0, 4, 6, 12, 4, 0, 6, 8],
  [0, 2, 9, 1, 0, 1, 3, 9, 1, 0, 3, 8],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 8, 0, 0, 0, 2, 8, 0, 0, 2, 8],
  [0, 2, 12, 4, 0, 0, 6, 12, 4, 4, 6, 8],
  [0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const boardObjectsMatrix = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

export class Board {
  cells: Cell[][] = []

  public initialCells() {
    for (let i = 0; i < boardWallsMatrix.length; i++) {
      const row: Cell[] = []
      for (let j = 0; j < boardWallsMatrix[0].length; j++) {
        const value = boardWallsMatrix[i][j]
        const valueObject = boardObjectsMatrix[i][j]
        const cell = new Cell(i, j, true)
        if (valueObject === 2) {
          cell.setType('car')
        }

        if (valueObject === 1) {
          cell.setType('start')
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
}
