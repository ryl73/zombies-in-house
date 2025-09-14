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
import { Cell } from '../game/models/Cell'

const CharacterMap: Record<number, Omit<PlayerProps, 'cellId'>> = {
  1: { lifeCount: 3, name: 'Саша', type: 'sasha' },
  2: { lifeCount: 5, name: 'Борис', type: 'boris' },
  3: { lifeCount: 3, name: 'Макс', type: 'max' },
  4: { lifeCount: 3, name: 'Надя', type: 'nadya' },
  5: { lifeCount: 3, name: 'Настя', type: 'nastya' },
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
  isZombieMove: boolean
  isProcessing: boolean
  moveCount: number
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
  isZombieMove: false,
  isProcessing: false,
  moveCount: 0,
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

const hasPlayerItem = (game: GameState, itemType: ItemType) =>
  getCurrentPlayer(game).items.find(i => i.type === itemType)

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
    await dispatch(spinPinwheel())
    const { game } = getState() as { game: GameState }
    const currentPlayer = getCurrentPlayer(game)
    if (!currentPlayer.cellId) return

    const zombieOnCell = getZombieByCellId(game, currentPlayer.cellId)

    const moveCount = game.moveCount
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

export const usePlayerItem = createAsyncThunk(
  'game/usePlayerItem',
  async (item: Item, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }
    if (game.isProcessing) return

    dispatch(gameSlice.actions.setIsProcessing(true))

    const player = getCurrentPlayer(game)

    const zombieOnCell = game.zombies.find(
      zombie => zombie.cellId === player.cellId
    )

    switch (item.type) {
      case 'medkit': {
        dispatch(gameSlice.actions.useItem(item.id))
        if (player.type === 'nastya') {
          dispatch(gameSlice.actions.addPlayerLifeCount(2))
          break
        }
        dispatch(gameSlice.actions.addPlayerLifeCount(1))
        break
      }
      case 'grenade': {
        if (zombieOnCell) {
          dispatch(gameSlice.actions.useItem(item.id))
          await dispatch(winFight())
        }
        break
      }
      case 'launcher': {
        if (zombieOnCell && zombieOnCell.type === 'boss') {
          dispatch(gameSlice.actions.useItem(item.id))
          await dispatch(winFight())
        }
        break
      }
      case 'coldWeapon':
      case 'gunWeapon': {
        if (zombieOnCell) {
          await dispatch(winFight())
        }
        break
      }

      case 'plank': {
        // if (currentCell?.type === 'plankPlace') {
        // player.cell.addItem(this)
        // this.cell = player.cell
        // dispatch(useItem(item.id))
        // }
        break
      }
    }

    dispatch(gameSlice.actions.setIsProcessing(false))
  }
)

export const handleCellClick = createAsyncThunk(
  'game/handleCellClick',
  async (cell: Cell, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }

    if (game.isProcessing) return

    dispatch(gameSlice.actions.setIsProcessing(true))

    if (getCurrentPlayer(game).isZombie) {
      await dispatch(handleZombieCellClick(cell))
    } else {
      await dispatch(handlePlayerCellClick(cell))
    }

    dispatch(gameSlice.actions.setIsProcessing(false))
  }
)

const handleZombieCellClick = createAsyncThunk(
  'game/handleZombieCellClick',
  async (cell: Cell, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }

    const zombieOnCell = game.zombies.find(zombie => zombie.cellId === cell.id)
    const playersOnCell = game.players.filter(
      player => player.cellId === cell.id
    )

    if (zombieOnCell && zombieOnCell.opened && !game.isZombieMove) {
      dispatch(gameSlice.actions.setPlayerCell(cell.id))
      dispatch(gameSlice.actions.setIsZombieMove(true))
      await dispatch(moveStage())
    } else {
      if (!cell.isTraversable) return

      dispatch(gameSlice.actions.setIsZombieMove(false))
      dispatch(gameSlice.actions.moveZombie(cell.id))

      if (playersOnCell.length === 0) {
        await dispatch(endTurn())
        return
      }

      const playerOnCellIndex = game.players.findIndex(
        player => player.id === playersOnCell[0].id
      )

      if (playerOnCellIndex === -1) return

      dispatch(gameSlice.actions.setCurrentPlayerIndex(playerOnCellIndex))
      await dispatch(fightStage())
    }
  }
)

const handlePlayerCellClick = createAsyncThunk(
  'game/handlePlayerCellClick',
  async (cell: Cell, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }

    const zombieOnCell = game.zombies.find(zombie => zombie.cellId === cell.id)
    const itemsOnCell = game.items.filter(item => item.cellId === cell.id)

    if (!cell.isTraversable) return

    dispatch(gameSlice.actions.movePlayer(cell.id))

    if (zombieOnCell) {
      dispatch(gameSlice.actions.setZombieOpen(zombieOnCell.id))

      if (hasPlayerItem(game, 'grenade')) {
        dispatch(gameSlice.actions.setCanFight('grenade'))
        return
      }

      if (hasPlayerItem(game, 'launcher') && zombieOnCell.type === 'boss') {
        dispatch(gameSlice.actions.setCanFight('launcher'))
        return
      }

      await dispatch(fightStage())
      return
    }

    if (itemsOnCell.length > 0) {
      for (const item of itemsOnCell) {
        if (item.type === 'key' && cell.type === 'car') {
          continue
        }
        dispatch(gameSlice.actions.pickItem(item.id))
      }
    }

    if (cell.type === 'car') {
      const keyOrGasoline = getCurrentPlayer(game).items.filter(
        item => item.type === 'key' || item.type === 'gasoline'
      )
      if (keyOrGasoline.length > 0) {
        keyOrGasoline.forEach(item => {
          dispatch(
            gameSlice.actions.setItemCell({ itemId: item.id, cellId: cell.id })
          )
          dispatch(gameSlice.actions.useItem(item.id))
        })
      }
    }

    await dispatch(endTurn())
  }
)

const spinPinwheel = createAsyncThunk(
  'game/spinPinwheel',
  async (_, { dispatch }) => {
    const { moveCount } = await spinPinWheel()
    dispatch(gameSlice.actions.setMoveCount(moveCount))
  }
)

export const manualSpinPinWheel = createAsyncThunk(
  'game/manualSpinPinWheel',
  async (_, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }

    if (game.canFight === 'grenade') {
      dispatch(gameSlice.actions.setCanFight(null))
      await dispatch(fightStage())
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
      state.isZombieMove = false
      state.isProcessing = false
      state.moveCount = 0
    },

    createCharacters(state) {
      const keys = Object.keys(CharacterMap).map(Number)
      const min = Math.min(...keys)
      const max = Math.max(...keys)
      const nextRandom = randomGenerator(min, max)

      for (let i = 0; i < 2; i++) {
        const result = nextRandom.next()
        if (result.done) break

        const startCell = state.board.cells[11][0]
        const player = createPlayer({
          ...CharacterMap[result.value],
          cellId: startCell.id,
        })
        startCell.isEmpty = false
        state.players.push(player)
      }
    },

    createItems(state) {
      Object.entries(ItemsMap).forEach(([name, value]) => {
        for (let i = 0; i < value.count; i++) {
          const randomX = getRandomInt(0, 11)
          const randomY = getRandomInt(0, 11)

          const cell = state.board.cells[randomX][randomY]
          if (!cell.isEmpty || cell.type === 'start') {
            i--
            continue
          }

          const item = createItem({
            name,
            cellId: cell.id,
            type: value.type,
          })
          cell.isEmpty = false
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
          if (!cell.isEmpty || cell.type === 'start') {
            i--
            continue
          }

          const zombie = createZombie({
            name: type,
            cellId: cell.id,
            type: type as ZombieType,
          })
          cell.isEmpty = false
          state.zombies.push(zombie)
        }
      })
    },

    setCanMoveCells(state, action: PayloadAction<number[]>) {
      state.board.cells.flat().forEach(cell => {
        cell.isTraversable = action.payload.includes(cell.id)
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
          cell.isTraversable = false
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

    setIsZombieMove(state, action: PayloadAction<boolean>) {
      state.isZombieMove = action.payload
    },

    setIsProcessing(state, action: PayloadAction<boolean>) {
      state.isProcessing = action.payload
    },

    setMoveCount(state, action: PayloadAction<number>) {
      state.moveCount = action.payload
    },
  },
})

export default gameSlice.reducer

export const currentPlayer = (state: RootState) =>
  state.game.players[state.game.currentPlayerIndex]
