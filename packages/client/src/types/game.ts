export type PlayerId = string
export type CellId = string

export interface PlayerState {
  id: PlayerId
  name: string
  cellId: CellId
  health: number
}

export interface CellState {
  id: CellId
  x: number
  y: number
  playerIds: PlayerId[] // несколько игроков
}

export interface BoardState {
  width: number
  height: number
  cells: CellState[]
}

export interface GameState {
  board: BoardState
  players: PlayerState[]
  currentPlayerIndex: number
  turn: number
  status: 'playing' | 'won' | 'lost'
}
