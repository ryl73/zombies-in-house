import { createRoom, getRoomById, updateRoomById } from '../api/GameAPI'
import { store } from '../store'
import Ws, { UserInfo } from '../api/ws'
import { gameSlice, moveStage } from '../slices/gameSlice'

export const createRoomRequest = async (): Promise<string | null> => {
  const userData = store.getState().user.data
  if (!userData) return null

  try {
    const { id } = await createRoom()
    store.dispatch(gameSlice.actions.setRoom({ id, hostId: userData.id }))
    wsConnect('create', id)
    return id
  } catch (e) {
    console.error(e)
  }
  return null
}

export const connectToRoomRequest = async (roomId: string): Promise<void> => {
  try {
    const state = await getRoomById(roomId)
    store.dispatch(
      gameSlice.actions.setRoom({ id: roomId, hostId: state.hostId })
    )
    wsConnect('connect', roomId)
    if (state.status === 'playing') {
      store.dispatch(gameSlice.actions.setIsLobbyDialogOpen(false))
      store.dispatch(gameSlice.actions.setState(state))
    }
  } catch (e) {
    console.error(e)
  }
}

const wsConnect = (type: 'connect' | 'create', roomId: string) => {
  Ws.connect(roomId)
  Ws.onMessage = async data => {
    if (data.type === 'room-users') {
      store.dispatch(
        gameSlice.actions.setUsers((data as { users: UserInfo[] }).users)
      )
    }
    if (data.type === 'updated') {
      const state = await getRoomById(roomId)
      if (type === 'connect') {
        store.dispatch(gameSlice.actions.setIsLobbyDialogOpen(false))
      }
      store.dispatch(gameSlice.actions.setState(state))
      const gameData = store.getState().game
      const userData = store.getState().user.data
      if (!userData) return

      const currentPlayer = gameData.players.find(
        player => player.userId === userData.id
      )
      if (
        gameData.currentPlayerIndex === currentPlayer?.index &&
        !currentPlayer.isZombie
      ) {
        await store.dispatch(moveStage())
      }
    }
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
