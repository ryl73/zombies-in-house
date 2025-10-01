import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { createPlayer, Player, PlayerProps } from '../game/models/Player'
import {
  Board,
  createBoard,
  findAllPaths,
  initCells,
} from '../game/models/Board'
import { PinWheelResult, getPinwheelResult } from '../game/models/PinWheel'
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

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

export interface GameState {
  board: Board
  players: Player[]
  items: Item[]
  zombies: Zombie[]
  turn: number
  currentPlayerIndex: number
  canFight: CanFightType
  status: GameStatus
  isZombieMove: boolean
  isProcessing: boolean
  barricadeSelection: {
    cellId: number
    availableDirections: string[]
    itemId: number
  } | null
  isAwaitingBarricadeDirection: boolean
  canSkipTurn: boolean
  isWinDialogOpen: boolean
  winningPlayerId: number | null
  pinwheelResult: PinWheelResult | null
  isPinwheelOpen: boolean
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
  barricadeSelection: null,
  isAwaitingBarricadeDirection: false,
  canSkipTurn: false,
  isWinDialogOpen: false,
  winningPlayerId: null,
  pinwheelResult: null,
  isPinwheelOpen: false,
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
    console.log(
      `🎲 Очередь ${currentPlayer.name} (${
        currentPlayer.isZombie ? 'Зомби' : 'Человек'
      })`
    )

    if (!currentPlayer.cellId) return
    if (!game.pinwheelResult) return

    const zombieOnCell = getZombieByCellId(game, currentPlayer.cellId)

    const { moveCount } = game.pinwheelResult
    console.log(`🎯 Выпало ${moveCount}`)
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
    dispatch(gameSlice.actions.setCanSkipTurn(true))
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
    await dispatch(spinPinwheel())

    const { game } = getState() as { game: GameState }
    if (!game.pinwheelResult) return
    const currentPlayer = getCurrentPlayer(game)

    dispatch(gameSlice.actions.setCanSkipTurn(false))

    const { action } = game.pinwheelResult
    console.log(`🎯 Результат вертушки: ${action}`)

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
    console.log('🔄 Конец хода')
    console.log('------------------------')

    dispatch(gameSlice.actions.setCanSkipTurn(false))
    // check status
    const alivePlayers = game.players.filter(p => !p.isZombie)
    if (alivePlayers.length === 0) {
      dispatch(gameSlice.actions.setGameStatus('lost'))
      return
    }

    const carCellIds = game.board.cells
      .flat()
      .filter(c => c.type === 'car')
      .map(c => c.id)
    const keyItem = game.items.find(i => i.type === 'key')
    const gasolineItem = game.items.find(i => i.type === 'gasoline')

    const isItemsOnCar =
      keyItem?.cellId &&
      carCellIds.includes(keyItem.cellId) &&
      gasolineItem?.cellId &&
      carCellIds.includes(gasolineItem.cellId)

    const player = getCurrentPlayer(game)
    const isPlayerOnCar = player.cellId && carCellIds.includes(player.cellId)

    if (isItemsOnCar && isPlayerOnCar) {
      dispatch(gameSlice.actions.openWinDialog(player.id))
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
    dispatch(gameSlice.actions.setCanSkipTurn(false))
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
        if (player.cellId === null) {
          dispatch(gameSlice.actions.setIsProcessing(false))
          return
        }

        const currentPlayerCell = getCellById(game, player.cellId)
        if (!currentPlayerCell || currentPlayerCell.type !== 'plankPlace') {
          console.log('❌ Нельзя установить баррикаду здесь')
          dispatch(gameSlice.actions.setIsProcessing(false))
          return
        }

        await dispatch(
          handleBarricadeDirectionSelection({
            cellId: currentPlayerCell.id,
            itemId: item.id,
          })
        )

        dispatch(gameSlice.actions.setIsProcessing(false))
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
    dispatch(gameSlice.actions.setCanSkipTurn(false))

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
        console.log(`🧟 Встретил зомби: ${zombieOnCell.name}`)
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

let pinwheelResolver: ((value: unknown) => void) | null

export const spinPinwheel = createAsyncThunk(
  'game/spinPinwheel',
  async (_, { dispatch }) => {
    dispatch(gameSlice.actions.setIsPinwheelOpen(false))
    dispatch(gameSlice.actions.setPinwheelResult(null))

    await new Promise(resolve => setTimeout(resolve, 100))

    const result = await getPinwheelResult()
    dispatch(gameSlice.actions.setIsPinwheelOpen(true))
    dispatch(gameSlice.actions.setPinwheelResult(result))

    console.log('🎡 Крутим вертушку...')
    await new Promise(resolve => {
      pinwheelResolver = resolve
    })
  }
)

export const resolvePinwheel = createAsyncThunk(
  'game/pinwheelResolver',
  async (_, { dispatch }) => {
    if (pinwheelResolver) {
      pinwheelResolver(null)
      pinwheelResolver = null
    }

    dispatch(gameSlice.actions.setIsPinwheelOpen(false))

    await new Promise(resolve => setTimeout(resolve, 100))
  }
)

export const manualSpinPinwheel = createAsyncThunk(
  'game/manualSpinPinWheel',
  async (_, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }

    if (game.canFight === 'grenade') {
      dispatch(gameSlice.actions.setCanFight(null))
      await dispatch(fightStage())
    }

    dispatch(gameSlice.actions.setIsPinwheelOpen(false))
  }
)

export const handleBarricadeDirectionSelection = createAsyncThunk(
  'game/barricadeDirectionSelection',
  async (
    { cellId, itemId }: { cellId: number; itemId: number },
    { getState, dispatch }
  ) => {
    const { game } = getState() as { game: GameState }
    const cell = getCellById(game, cellId)

    if (!cell) {
      return
    }

    const availableDirections = Object.entries(
      cell.availableBarricadeDirections
    )
      .filter(
        ([dir, available]) =>
          available &&
          !cell.installedBarricadeDirections[
            dir as keyof typeof cell.installedBarricadeDirections
          ]
      )
      .map(([dir]) => dir)

    if (availableDirections.length === 0) {
      return
    }

    // Если доступно только одно направление, устанавливаем баррикаду сразу
    if (availableDirections.length === 1) {
      dispatch(
        gameSlice.actions.installBarricade({
          cellId,
          direction: availableDirections[0],
          itemId,
        })
      )
      return
    }

    // Если несколько направлений, показываем UI для выбора
    dispatch(
      gameSlice.actions.startBarricadeSelection({
        cellId,
        availableDirections,
        itemId,
      })
    )
  }
)

export const skipTurn = createAsyncThunk(
  'game/skipTurn',
  async (_, { getState, dispatch }) => {
    const { game } = getState() as { game: GameState }

    if (!game.canSkipTurn || game.isProcessing) {
      console.log('❌ Сейчас нельзя пропустить ход')
      return
    }

    dispatch(gameSlice.actions.setIsProcessing(true))
    console.log('⏭️ Игрок пропускает ход')

    dispatch(gameSlice.actions.setCanSkipTurn(false))
    dispatch(gameSlice.actions.resetCanMoveCells())
    await dispatch(endTurn())

    dispatch(gameSlice.actions.setIsProcessing(false))
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
      state.pinwheelResult = null
      state.isPinwheelOpen = false
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
        console.log(`🎒 ${currentPlayer.name} подобрал: ${item.name}`)
      }
    },

    useItem(state, action: PayloadAction<number>) {
      const currentPlayer = getCurrentPlayer(state)
      const item = getItemById(state, action.payload)
      if (item) {
        currentPlayer.items = currentPlayer.items.filter(i => i.id !== item.id)
        console.log(`🎒 Используется: ${item.name}`)
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
    startBarricadeSelection(
      state,
      action: PayloadAction<{
        cellId: number
        availableDirections: string[]
        itemId: number
      }>
    ) {
      state.barricadeSelection = action.payload
      state.isAwaitingBarricadeDirection = true
    },
    selectBarricadeDirection(state, action: PayloadAction<string>) {
      if (state.barricadeSelection) {
        const { cellId, itemId } = state.barricadeSelection
        const cell = getCellById(state, cellId)
        if (cell) {
          cell.installedBarricadeDirections[
            action.payload as keyof typeof cell.installedBarricadeDirections
          ] = true
          cell.hasBarricade = true
          const currentPlayer = getCurrentPlayer(state)
          currentPlayer.items = currentPlayer.items.filter(
            item => item.id !== itemId
          )
        }
      }
      state.barricadeSelection = null
      state.isAwaitingBarricadeDirection = false
    },
    cancelBarricadeSelection(state) {
      state.barricadeSelection = null
      state.isAwaitingBarricadeDirection = false
    },
    installBarricade(
      state,
      action: PayloadAction<{
        cellId: number
        direction: string
        itemId: number
      }>
    ) {
      const cell = state.board.cells
        .flat()
        .find(c => c.id === action.payload.cellId)
      if (cell) {
        cell.installedBarricadeDirections[
          action.payload
            .direction as keyof typeof cell.installedBarricadeDirections
        ] = true
        cell.hasBarricade = true
        const currentPlayer = getCurrentPlayer(state)
        currentPlayer.items = currentPlayer.items.filter(
          item => item.id !== action.payload.itemId
        )
      }
    },
    setCanSkipTurn(state, action: PayloadAction<boolean>) {
      state.canSkipTurn = action.payload
    },
    openWinDialog(state, action: PayloadAction<number>) {
      state.isWinDialogOpen = true
      state.winningPlayerId = action.payload
    },
    closeWinDialog(state) {
      state.isWinDialogOpen = false
      state.winningPlayerId = null
    },
    confirmWin(state) {
      state.status = 'won'
      state.isWinDialogOpen = false
      state.winningPlayerId = null
    },
    setGameStatus(state, action: PayloadAction<GameStatus>) {
      state.status = action.payload
    },

    setPinwheelResult(state, action: PayloadAction<PinWheelResult | null>) {
      state.pinwheelResult = action.payload
    },

    setIsPinwheelOpen(state, action: PayloadAction<boolean>) {
      state.isPinwheelOpen = action.payload
    },
  },
})

export default gameSlice.reducer

export const currentPlayer = (state: RootState) =>
  state.game.players[state.game.currentPlayerIndex]
