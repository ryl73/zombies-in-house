// gameSlice.test.ts
import { AnyAction, configureStore, ThunkMiddleware } from '@reduxjs/toolkit'
import reducer, {
  endTurn,
  fightStage,
  gameSlice,
  GameState,
  handleCellClick,
  moveStage,
  playerBitten,
  startGame,
  usePlayerItem,
} from './gameSlice'
import { createPlayer } from '../game/models/Player'
import { createZombie, ZombieType } from '../game/models/Zombie'
import { createItem, ItemType } from '../game/models/Item'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { Cell } from '../game/models/Cell'
import * as gameSliceModule from '../slices/gameSlice'

jest.spyOn(gameSliceModule, 'spinPinwheel').mockImplementation((): any => {
  return (dispatch: any) => {
    dispatch(
      gameSliceModule.gameSlice.actions.setPinwheelResult({
        moveCount: 1,
        action: 'run',
      })
    )
    return Promise.resolve()
  }
})

// Mock spinPinWheel to control randomness
jest.mock('../game/models/PinWheel', () => ({
  getPinwheelResult: jest.fn().mockResolvedValue({
    moveCount: 1,
    action: 'run',
  }),
}))

let store: ToolkitStore<
  { game: GameState },
  AnyAction,
  [ThunkMiddleware<{ game: GameState }, AnyAction, undefined>]
>

const baseInitialState = reducer(undefined, { type: '@@INIT' })

function setupStore(preloadedState?: Partial<typeof baseInitialState>) {
  return configureStore({
    reducer: { game: reducer },
    preloadedState: {
      game: {
        ...baseInitialState,
        ...store?.getState()?.game,
        ...preloadedState,
      },
    },
  })
}

function createTestPlayer(cell: Cell, overrides = {}) {
  return createPlayer({
    name: 'Test',
    lifeCount: 3,
    type: 'boris',
    cellId: cell.id,
    ...overrides,
  })
}

function createTestZombie(cell: Cell, overrides = {}) {
  return createZombie({
    name: 'ordinary',
    type: 'ordinary',
    cellId: cell.id,
    ...overrides,
  })
}

function createTestItem(cell: Cell, overrides = {}) {
  return createItem({
    name: 'test',
    type: 'coldWeapon',
    cellId: cell.id,
    ...overrides,
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  store = setupStore()
  store.dispatch(gameSlice.actions.resetBoard())
})

describe('gameSlice reducers', () => {
  it('resetBoard should clear state and set status to playing', () => {
    const state = store.getState().game

    expect(state.players).toEqual([])
    expect(state.items).toEqual([])
    expect(state.zombies).toEqual([])
    expect(state.turn).toBe(1)
    expect(state.status).toBe('playing')
  })

  it('pickItem should move item from board to player inventory', () => {
    const cell = store.getState().game.board.cells[2][2]

    const player = createTestPlayer(cell)
    const item = createTestItem(cell)

    store = setupStore({ players: [player], items: [item] })

    store.dispatch(gameSlice.actions.pickItem(item.id))
    const state = store.getState().game

    expect(state.players[0].items).toHaveLength(1)
    expect(state.players[0].items[0].id).toBe(item.id)
    expect(state.items[0].cellId).toBeNull()
  })

  it('killZombie should remove zombie from player cell', () => {
    const cell = store.getState().game.board.cells[2][2]

    const player = createTestPlayer(cell)
    const zombie = createTestZombie(cell)

    store = setupStore({ players: [player], zombies: [zombie] })

    store.dispatch(gameSlice.actions.killZombie())
    const state = store.getState().game

    expect(state.zombies).toHaveLength(0)
    expect(state.canFight).toBeNull()
  })
})

describe('game engine', () => {
  describe('gameSlice thunks', () => {
    it('startGame should dispatch setup actions', async () => {
      await store.dispatch(startGame())

      const state = store.getState().game
      expect(state.players.length).toBeGreaterThan(0)
      expect(state.items.length).toBeGreaterThan(0)
      expect(state.zombies.length).toBeGreaterThan(0)
      expect(state.status).toBe('playing')
    })

    it('moveStage should set traversable cells', async () => {
      const cell = store.getState().game.board.cells[11][0]

      const player = createTestPlayer(cell)

      store = setupStore({ players: [player] })

      await store.dispatch(moveStage())

      const stateWithPlayer = store.getState().game

      const traversableCells = stateWithPlayer.board.cells
        .flat()
        .filter(c => c.isTraversable)
      expect(traversableCells.length).toBeGreaterThan(0)
    })

    it('fightStage with "run" action should call moveStage', async () => {
      const cell = store.getState().game.board.cells[11][0]

      const player = createTestPlayer(cell)

      store = setupStore({ players: [player] })

      await store.dispatch(fightStage())

      const stateWithPlayer = store.getState().game

      const traversableCells = stateWithPlayer.board.cells
        .flat()
        .filter(c => c.isTraversable)
      expect(traversableCells.length).toBeGreaterThan(0)
    })

    it('endTurn should increment turn and cycle player index', async () => {
      const cell = store.getState().game.board.cells[11][0]

      const p1 = createTestPlayer(cell)
      const p2 = createTestPlayer(cell, { type: 'sasha' })

      store = setupStore({ players: [p1, p2] })

      await store.dispatch(endTurn())
      const state = store.getState().game

      expect(state.turn).toBe(2)
      expect(state.currentPlayerIndex).toBe(1)
    })

    describe('using player items', () => {
      function setupStoreForItems(itemType: ItemType, zombieType: ZombieType) {
        const cell = store.getState().game.board.cells[11][0]

        const player = createTestPlayer(cell)
        const zombie = createTestZombie(cell, { type: zombieType })
        const item = createTestItem(cell, { cellId: null, type: itemType })

        store = setupStore({
          players: [player],
          zombies: [zombie],
          items: [item],
        })

        store.dispatch(gameSlice.actions.pickItem(item.id))
        store.dispatch(usePlayerItem(item))
        return { state: store.getState().game, player: player }
      }

      it('add extra life to player when using medkit', () => {
        const { state, player } = setupStoreForItems('medkit', 'ordinary')
        expect(state.players[0].lifeCount).toBe(player.lifeCount + 1)
        expect(state.players[0].items).toHaveLength(0)
      })

      it('removes zombie in cell when using grenade', () => {
        const { state } = setupStoreForItems('grenade', 'ordinary')
        expect(state.zombies).toHaveLength(0)
        expect(state.canFight).toBeNull()
        expect(state.players[0].items).toHaveLength(0)
      })

      it('removes zombie in cell when using cold/gun weapon', () => {
        const { state } = setupStoreForItems('coldWeapon', 'ordinary')
        expect(state.zombies).toHaveLength(0)
        expect(state.canFight).toBeNull()
        expect(state.players[0].items).toHaveLength(1)
      })

      it('removes boss zombie in cell when using launcher', () => {
        const { state } = setupStoreForItems('launcher', 'boss')
        expect(state.zombies).toHaveLength(0)
        expect(state.canFight).toBeNull()
        expect(state.players[0].items).toHaveLength(0)
      })
    })

    it('when player bitten life count should decrease', async () => {
      const cell = store.getState().game.board.cells[11][0]

      const player = createTestPlayer(cell)
      const zombie = createTestZombie(cell)

      store = setupStore({
        players: [player],
        zombies: [zombie],
      })

      await store.dispatch(playerBitten())
      const state = store.getState().game
      expect(state.players[0].lifeCount).toBe(player.lifeCount - 1)
    })

    it('when player bitten and life count is 0 he should become zombie', async () => {
      const cell = store.getState().game.board.cells[11][0]

      const p1 = createTestPlayer(cell, { lifeCount: 1 })
      const p2 = createTestPlayer(cell, { type: 'sasha' })
      const zombie = createTestZombie(cell)

      store = setupStore({
        players: [p1, p2],
        zombies: [zombie],
      })

      await store.dispatch(playerBitten())
      const state = store.getState().game
      expect(state.players[0].lifeCount).toBe(0)
      expect(state.players[0].cellId).toBe(null)
      expect(state.players[0].items).toHaveLength(0)
      expect(state.players[0].isZombie).toBe(true)
    })

    describe('player on cell click', () => {
      async function setupStoreForCellClick(isCellZombie: boolean) {
        const playerCell = store.getState().game.board.cells[11][0]
        const targetCell = store.getState().game.board.cells[10][0]

        const player = createTestPlayer(playerCell)
        const zombie = createTestZombie(targetCell)
        const item = createTestItem(targetCell, { type: 'medkit' })

        store = setupStore({
          players: [player],
          zombies: isCellZombie ? [zombie] : [],
          items: [item],
        })

        await store.dispatch(moveStage())
        await store.dispatch(
          handleCellClick(store.getState().game.board.cells[10][0])
        )

        return { state: store.getState().game, targetCell: targetCell }
      }

      it('when player click on cell with zombie fight should start', async () => {
        const { state, targetCell } = await setupStoreForCellClick(true)
        expect(state.players[0].cellId).toBe(targetCell.id)
        expect(state.zombies[0].opened).toBe(true)

        const traversableCells = state.board.cells
          .flat()
          .filter(c => c.isTraversable)
        expect(traversableCells.length).toBeGreaterThan(0)
      })

      it('when player click on cell with item it should be picked', async () => {
        const { state } = await setupStoreForCellClick(false)

        expect(state.players[0].items).toHaveLength(1)
        expect(state.items[0].cellId).toBe(null)
        expect(state.items[0].opened).toBe(true)
      })

      it('when player click on car cell with items they should be placed', async () => {
        const playerCell = store.getState().game.board.cells[1][7]
        const targetCell = store.getState().game.board.cells[1][8]

        const player = createTestPlayer(playerCell)
        const itemKey = createTestItem(playerCell, { type: 'key' })

        store = setupStore({
          players: [player],
          items: [itemKey],
        })

        store.dispatch(gameSlice.actions.pickItem(itemKey.id))

        await store.dispatch(moveStage())
        await store.dispatch(
          handleCellClick(store.getState().game.board.cells[1][8])
        )

        const state = store.getState().game

        expect(state.players[0].items).toHaveLength(0)
        expect(state.items[0].cellId).toBe(targetCell.id)
      })

      it('when player is zombie and click on zombie cell zombie should become player', async () => {
        const playerCell = store.getState().game.board.cells[1][7]
        const zombieCell = store.getState().game.board.cells[2][2]

        const p1 = createTestPlayer(playerCell)
        const p2 = createTestPlayer(playerCell, { type: 'sasha' })
        const zombie = createTestZombie(zombieCell)

        store = setupStore({
          players: [p1, p2],
          zombies: [zombie],
        })

        store.dispatch(gameSlice.actions.setPlayerZombie())
        store.dispatch(gameSlice.actions.setZombieOpen(zombie.id))

        await store.dispatch(
          handleCellClick(store.getState().game.board.cells[2][2])
        )

        const state = store.getState().game

        expect(state.players[0].cellId).toBe(zombieCell.id)
        expect(state.isZombieMove).toBe(true)
      })
    })
  })
})
