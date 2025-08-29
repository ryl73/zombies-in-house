import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { createPlayer, Player, PlayerProps } from '../game/models/Player'
import {
  Board,
  createBoard,
  findAllPaths,
  initCells,
} from '../game/models/Board'
import { spinPinWheel } from '../game/models/PinWheel'
import { getRandomInt, randomGenerator } from '../utils/random'
import { createZombie, Zombie, ZombieType } from '../game/models/Zombie'
import { createItem, Item, ItemType } from '../game/models/Item'
import { RootState } from '../store'

const CharacterMap: Record<number, Omit<PlayerProps, 'cellId'>> = {
  1: { lifeCount: 3, name: 'Саша', image: '', type: 'sasha' },
  2: { lifeCount: 5, name: 'Борис', image: '', type: 'boris' },
  3: { lifeCount: 3, name: 'Макс', image: '', type: 'max' },
  4: { lifeCount: 3, name: 'Надя', image: '', type: 'nadya' },
  5: { lifeCount: 3, name: 'Настя', image: '', type: 'nastya' },
}

const ItemsMap: Record<string, { count: number; type: ItemType }> = {
  grenade: { count: 4, type: 'grenade' },
  knife: { count: 1, type: 'coldWeapon' },
  crossbow: { count: 1, type: 'coldWeapon' },
  axe: { count: 1, type: 'coldWeapon' },
  handgun: { count: 1, type: 'gunWeapon' },
  machineGun: { count: 1, type: 'gunWeapon' },
  shotgun: { count: 1, type: 'gunWeapon' },
  launcher: { count: 1, type: 'launcher' },
  medkit: { count: 6, type: 'medkit' },
  plank: { count: 8, type: 'plank' },
  gasoline: { count: 1, type: 'gasoline' },
  key: { count: 1, type: 'key' },
}

const ZombieMap: Record<ZombieType, { count: number }> = {
  ordinary: { count: 17 },
  dog: { count: 5 },
  spider: { count: 5 },
  boss: { count: 1 },
}

export type CanFightType =
  | 'coldWeapon'
  | 'gunWeapon'
  | 'grenade'
  | 'launcher'
  | null

export interface GameState {
  board: Board
  players: Player[]
  items: Item[]
  zombies: Zombie[]
  turn: number
  currentPlayerIndex: number
  canFight: CanFightType
  status: 'idle' | 'playing' | 'won' | 'lost'
}

const initialState: GameState = {
  board: createBoard(),
  players: [],
  items: [],
  zombies: [],
  turn: 1,
  currentPlayerIndex: 0,
  canFight: null,
  status: 'idle',
}

const getCurrentPlayer = (game: GameState) =>
  game.players[game.currentPlayerIndex]

const getCellById = (game: GameState, id: number) =>
  game.board.cells.flat().find(cell => cell.id === id)

const getItemById = (game: GameState, id: number) =>
  game.items.find(item => item.id === id)

const getZombieById = (game: GameState, id: number) =>
  game.zombies.find(zombie => zombie.id === id)

const getZombieByCellId = (game: GameState, cellId: number) =>
  game.zombies.find(zombie => zombie.cellId === cellId)

// ----------- Async actions (thunks) ----------------

export const startGame = createAsyncThunk(
  'game/start',
  async (_, { dispatch }) => {
    dispatch(gameSlice.actions.resetBoard())
    dispatch(gameSlice.actions.createCharacters())
    dispatch(gameSlice.actions.createItems())
    dispatch(gameSlice.actions.createZombies())
    await dispatch(moveStage())
  }
)

export const moveStage = createAsyncThunk(
  'game/moveStage',
  async (_, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }
    const currentPlayer = getCurrentPlayer(game)
    if (!currentPlayer.cellId) return

    const zombieOnCell = getZombieByCellId(game, currentPlayer.cellId)

    const { moveCount } = await spinPinWheel()
    console.log(moveCount)
    let maxMoveCount = moveCount

    if (currentPlayer.type === 'max' && !currentPlayer.isZombie) {
      maxMoveCount++
    }
    if (currentPlayer.isZombie) {
      if (zombieOnCell) {
        if (zombieOnCell.type === 'ordinary') {
          maxMoveCount--
          if (maxMoveCount === 0) {
            await dispatch(endTurn())
          }
        }
        if (zombieOnCell.type === 'dog') {
          maxMoveCount++
        }
      }
    }

    const currentPlayerCell = getCellById(game, currentPlayer.cellId)
    if (!currentPlayerCell) return

    const availableCells = findAllPaths(
      currentPlayerCell,
      game,
      moveCount,
      maxMoveCount,
      currentPlayer.isZombie
    )

    dispatch(gameSlice.actions.setCanMoveCells(availableCells.map(c => c.id)))
  }
)

export const playerBitten = createAsyncThunk(
  'game/playerBitten',
  async (_, { getState, dispatch }) => {
    dispatch(gameSlice.actions.bitePlayer())

    const { game } = getState() as { game: GameState }
    const player = getCurrentPlayer(game)
    if (player.lifeCount <= 0 && player.cellId) {
      for (const item of player.items) {
        dispatch(
          gameSlice.actions.setItemCell({
            itemId: item.id,
            cellId: player.cellId,
          })
        )
        dispatch(gameSlice.actions.useItem(item.id))
      }
      dispatch(gameSlice.actions.setPlayerZombie())
      dispatch(gameSlice.actions.removePlayer())
      await dispatch(endTurn())
    } else {
      await dispatch(fightStage())
    }
  }
)

export const winFight = createAsyncThunk(
  'game/winFight',
  async (_, { getState, dispatch }) => {
    dispatch(gameSlice.actions.killZombie())
    const { game } = getState() as { game: GameState }

    const player = getCurrentPlayer(game)
    if (!player.cellId) return

    const playerCell = getCellById(game, player.cellId)
    if (!playerCell) return

    const itemsOnCell = game.items.filter(item => item.cellId === playerCell.id)

    if (itemsOnCell.length > 0) {
      for (const item of itemsOnCell) {
        if (item.type === 'key' && playerCell.type === 'car') {
          continue
        }
        dispatch(gameSlice.actions.pickItem(item.id))
      }
    }
    await dispatch(endTurn())
  }
)

export const fightStage = createAsyncThunk(
  'game/fightStage',
  async (_, { getState, dispatch }) => {
    dispatch(gameSlice.actions.resetCanMoveCells())
    const { game } = getState() as { game: GameState }
    const currentPlayer = getCurrentPlayer(game)

    const { action } = await spinPinWheel()
    console.log(action)

    const fight = async (weaponType: 'coldWeapon' | 'gunWeapon') => {
      if (!currentPlayer.cellId) return

      const zombieOnCell = getZombieByCellId(game, currentPlayer.cellId)
      const hasWeapon =
        currentPlayer.items.some(i => i.type === weaponType) &&
        zombieOnCell?.type !== 'boss'

      if (hasWeapon) {
        dispatch(gameSlice.actions.setCanFight(weaponType))
      } else {
        await dispatch(fightStage())
      }
    }

    switch (action) {
      case 'run': {
        await dispatch(moveStage())
        break
      }
      case 'bite': {
        await dispatch(playerBitten())
        break
      }
      case 'closeFight': {
        await fight('coldWeapon')
        break
      }
      case 'shoot': {
        await fight('gunWeapon')
        break
      }
    }
  }
)

export const endTurn = createAsyncThunk(
  'game/endTurn',
  async (_, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }

    // check status
    const alivePlayers = game.players.filter(p => !p.isZombie)
    if (alivePlayers.length === 0) {
      alert('You lost!')
      return
    }

    const carCellIds = game.board.cells
      .flat()
      .filter(c => c.type === 'car')
      .map(c => c.id)
    const keyItem = game.items.find(i => i.type === 'key')
    const gasolineItem = game.items.find(i => i.type === 'gasoline')

    if (
      keyItem?.cellId &&
      carCellIds.includes(keyItem.cellId) &&
      gasolineItem?.cellId &&
      carCellIds.includes(gasolineItem.cellId)
    ) {
      alert('You win!')
      return
    }

    // advance player turn
    const nextIndex = (game.currentPlayerIndex + 1) % game.players.length
    dispatch(gameSlice.actions.setCurrentPlayerIndex(nextIndex))
    dispatch(gameSlice.actions.incrementTurn())

    const currentPlayer = game.players[nextIndex]

    dispatch(gameSlice.actions.resetCanMoveCells())

    if (!currentPlayer.isZombie) {
      await dispatch(moveStage())
    } else {
      if (game.zombies.every(z => !z.opened)) {
        await dispatch(endTurn()) // skip to next if all zombies closed
      }
    }
  }
)

// ----------- Slice ----------------

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetBoard(state) {
      state.board = initCells(state.board)
      state.players = []
      state.items = []
      state.zombies = []
      state.turn = 1
      state.currentPlayerIndex = 0
      state.canFight = null
      state.status = 'playing'
    },

    createCharacters(state) {
      const keys = Object.keys(CharacterMap).map(Number)
      const min = Math.min(...keys)
      const max = Math.max(...keys)
      const nextRandom = randomGenerator(min, max)

      for (let i = 0; i < 2; i++) {
        const randomNumber = nextRandom()
        if (randomNumber === null) break

        const startCell = state.board.cells[11][0]
        const player = createPlayer({
          ...CharacterMap[randomNumber],
          cellId: startCell.id,
        })
        startCell.empty = false
        state.players.push(player)
      }
    },

    createItems(state) {
      Object.entries(ItemsMap).forEach(([name, value]) => {
        for (let i = 0; i < value.count; i++) {
          const randomX = getRandomInt(0, 11)
          const randomY = getRandomInt(0, 11)

          const cell = state.board.cells[randomX][randomY]
          if (!cell.empty || cell.type === 'start') {
            i--
            continue
          }

          const item = createItem({
            image: '',
            name,
            cellId: cell.id,
            type: value.type,
          })
          cell.empty = false
          state.items.push(item)
        }
      })
    },

    createZombies(state) {
      Object.entries(ZombieMap).forEach(([type, value]) => {
        for (let i = 0; i < value.count; i++) {
          const randomX = getRandomInt(0, 11)
          const randomY = getRandomInt(0, 11)

          const cell = state.board.cells[randomX][randomY]
          if (!cell.empty || cell.type === 'start') {
            i--
            continue
          }

          const zombie = createZombie({
            image: '',
            name: type,
            cellId: cell.id,
            type: type as ZombieType,
          })
          cell.empty = false
          state.zombies.push(zombie)
        }
      })
    },

    setCanMoveCells(state, action: PayloadAction<number[]>) {
      state.board.cells.flat().forEach(cell => {
        cell.canMove = action.payload.includes(cell.id)
      })
    },

    setCanFight(state, action: PayloadAction<CanFightType>) {
      state.canFight = action.payload
    },

    setCurrentPlayerIndex(state, action: PayloadAction<number>) {
      state.currentPlayerIndex = action.payload
    },

    incrementTurn(state) {
      state.turn += 1
    },

    resetCanMoveCells(state) {
      state.board.cells.forEach(row => {
        row.forEach(cell => {
          cell.canMove = false
        })
      })
    },

    movePlayer(state, action: PayloadAction<number>) {
      getCurrentPlayer(state).cellId = action.payload
    },

    moveZombie(state, action: PayloadAction<number>) {
      const currentPlayer = state.players[state.currentPlayerIndex]

      if (currentPlayer.cellId) {
        const zombieOnCell = getZombieByCellId(state, currentPlayer.cellId)
        if (zombieOnCell) {
          zombieOnCell.cellId = action.payload
          getCurrentPlayer(state).cellId = null
        }
      }
    },

    bitePlayer(state) {
      getCurrentPlayer(state).lifeCount--
    },

    setPlayerZombie(state) {
      getCurrentPlayer(state).isZombie = true
    },

    removePlayer(state) {
      getCurrentPlayer(state).cellId = null
    },

    setZombieOpen(state, action: PayloadAction<number>) {
      const zombie = getZombieById(state, action.payload)
      if (zombie) {
        zombie.opened = true
      }
    },

    setItemOpen(state, action: PayloadAction<number>) {
      const item = getItemById(state, action.payload)
      if (item) {
        item.opened = true
      }
    },

    pickItem(state, action: PayloadAction<number>) {
      const currentPlayer = getCurrentPlayer(state)

      const item = getItemById(state, action.payload)

      if (item) {
        item.opened = true
        item.cellId = null
        currentPlayer.items = [...currentPlayer.items, item]
      }
    },

    useItem(state, action: PayloadAction<number>) {
      const currentPlayer = getCurrentPlayer(state)
      const item = getItemById(state, action.payload)
      if (item) {
        currentPlayer.items = currentPlayer.items.filter(i => i.id !== item.id)
      }
    },

    setItemCell(
      state,
      action: PayloadAction<{ itemId: number; cellId: number }>
    ) {
      const item = getItemById(state, action.payload.itemId)
      if (item) {
        item.cellId = action.payload.cellId
      }
    },

    addPlayerLifeCount(state, action: PayloadAction<number>) {
      const currentPlayer = getCurrentPlayer(state)
      currentPlayer.lifeCount += action.payload
    },

    killZombie(state) {
      const currentPlayer = getCurrentPlayer(state)
      if (currentPlayer.cellId) {
        state.zombies = state.zombies.filter(
          z => z.cellId !== currentPlayer.cellId
        )
        state.canFight = null
      }
    },

    setPlayerCell(state, action: PayloadAction<number>) {
      getCurrentPlayer(state).cellId = action.payload
    },
  },
})

export const {
  setCurrentPlayerIndex,
  setPlayerCell,
  setCanFight,
  movePlayer,
  moveZombie,
  setZombieOpen,
  pickItem,
  useItem,
  setItemCell,
  addPlayerLifeCount,
} = gameSlice.actions

export default gameSlice.reducer

export const currentPlayer = (state: RootState) =>
  state.game.players[state.game.currentPlayerIndex]
