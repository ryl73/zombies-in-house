import { createRoom, getRoomById, updateRoomById } from '../api/GameAPI'
import { store } from '../store'
import Ws, { UserInfo } from '../api/ws'
import { createState, gameSlice, moveStage } from '../slices/gameSlice'

export const createRoomRequest = async (): Promise<void> => {
  const userData = store.getState().user.data
  if (!userData) return

  try {
    const { id } = await createRoom()
    store.dispatch(gameSlice.actions.setRoom({ id, hostId: userData.id }))
    Ws.connect(id)
    Ws.onMessage = async data => {
      if (data.type === 'room-users') {
        store.dispatch(
          gameSlice.actions.setUsers((data as { users: UserInfo[] }).users)
        )
      }
      if (data.type === 'updated') {
        const state = await getRoomById(id)
        store.dispatch(gameSlice.actions.setState(state))
        const gameData = store.getState().game
        const userData = store.getState().user.data
        if (!userData) return

        if (
          gameData.currentPlayerIndex ===
          gameData.players.findIndex(player => player.userId === userData.id)
        ) {
          await store.dispatch(moveStage())
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export const connectToRoomRequest = async (roomId: string): Promise<void> => {
  try {
    const state = await getRoomById(roomId)
    store.dispatch(
      gameSlice.actions.setRoom({ id: roomId, hostId: state.hostId })
    )
    Ws.connect(roomId)
    Ws.onMessage = async data => {
      if (data.type === 'room-users') {
        store.dispatch(
          gameSlice.actions.setUsers((data as { users: UserInfo[] }).users)
        )
      }
      if (data.type === 'updated') {
        const state = await getRoomById(roomId)
        store.dispatch(gameSlice.actions.setIsLobbyDialogOpen(false))
        if (store.getState().game.players.length === 0) {
          store.dispatch(createState())
        }
        store.dispatch(gameSlice.actions.setState(state))
        const gameData = store.getState().game
        const userData = store.getState().user.data
        if (!userData) return

        if (
          gameData.currentPlayerIndex ===
          gameData.players.find(player => player.userId === userData.id)?.index
        ) {
          await store.dispatch(moveStage())
        }
      }
    }
    if (state.status === 'playing') {
      store.dispatch(gameSlice.actions.setIsLobbyDialogOpen(false))
      store.dispatch(gameSlice.actions.setState(state))
    }
  } catch (e) {
    console.error(e)
  }
}

export const updateRoomRequest = async (roomId: string): Promise<void> => {
  const gameData = store.getState().game

  try {
    await updateRoomById(roomId, gameData)
  } catch (e) {
    console.error(e)
  }
}
