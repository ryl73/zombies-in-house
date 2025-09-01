import { Cell, createCell } from './Cell'
import { GameState } from '../../slices/gameSlice'
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

export type Board = {
  cells: Cell[][]
}

export function createBoard(): Board {
  return {
    cells: [],
  }
}

export function initCells(board: Board): Board {
  const cells: Cell[][] = []
  for (let i = 0; i < boardWallsMatrix.length; i++) {
    const row: Cell[] = []
    for (let j = 0; j < boardWallsMatrix[0].length; j++) {
      const value = boardWallsMatrix[i][j]
      const valueObject = boardObjectsMatrix[i][j]
      const cell = createCell(i, j)
      if (valueObject === 2) {
        cell.type = 'car'
      }

      if (valueObject === 1) {
        cell.type = 'start'
      }
      cell.walls = {
        top: (value & 1) !== 0,
        right: (value & 2) !== 0,
        bottom: (value & 4) !== 0,
        left: (value & 8) !== 0,
      }
      row.push(cell)
    }
    cells.push(row)
  }

  return {
    ...board,
    cells,
  }
}

export function findAllPaths(
  start: Cell,
  game: GameState,
  moveCount: number,
  maxMoveCount: number,
  isZombieTurn = false
): Cell[] {
  const rows = game.board.cells.length
  const cols = game.board.cells[0].length

  const results: Cell[] = []

  function canMove(
    current: Cell,
    next: Cell,
    dir: { dx: number; dy: number }
  ): boolean {
    if (dir.dx === 1) return !current.walls.bottom && !next.walls.top
    if (dir.dx === -1) return !current.walls.top && !next.walls.bottom
    if (dir.dy === 1) return !current.walls.right && !next.walls.left
    if (dir.dy === -1) return !current.walls.left && !next.walls.right
    return false
  }

  function isBlockingCell(nextCell: Cell, isZombieTurn: boolean) {
    const zombieOnNextCell = game.zombies.find(z => z.cellId === nextCell.id)
    const playersOnNextCell = game.players.filter(p => p.cellId === nextCell.id)
    const itemsOnNextCell = game.items.filter(i => i.cellId === nextCell.id)

    const isZombie = !!zombieOnNextCell
    const isItems = itemsOnNextCell.length > 0
    const isPlayer = playersOnNextCell.length > 0

    if (!isZombieTurn && (isZombie || isItems)) {
      results.push(nextCell)
      return true
    }

    if (isZombieTurn && isPlayer) {
      results.push(nextCell)
      return true
    }
    return false
  }

  const directions = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ]

  function dfs(current: Cell, steps: number, visited: Set<number>) {
    const playersOnCell = game.players.filter(p => p.cellId === current.id)
    const zombieOnCell = game.zombies.find(z => z.cellId === current.id)

    for (const dir of directions) {
      if (steps === moveCount || steps === maxMoveCount) {
        if (
          (!isZombieTurn && playersOnCell.length === 0) ||
          (isZombieTurn && !zombieOnCell)
        ) {
          results.push(current)
        }

        if (steps === maxMoveCount || moveCount >= maxMoveCount) {
          return
        }
      }

      const nx = current.x + dir.dx
      const ny = current.y + dir.dy

      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue

      const nextCell = game.board.cells[nx][ny]
      if (!nextCell) continue

      if (!canMove(current, nextCell, dir)) continue

      const key = nextCell.id
      if (visited.has(key)) continue

      if (isBlockingCell(nextCell, isZombieTurn)) continue

      visited.add(key)
      dfs(nextCell, steps + 1, visited)
      visited.delete(key)
    }
  }

  dfs(start, 0, new Set([start.id]))

  return results
}
