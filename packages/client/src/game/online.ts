import { createRoom, updateRoomById } from '../api/GameAPI'
import { store } from '../store'
import Ws, { UserInfo } from '../api/ws'
import { gameSlice } from '../slices/gameSlice'

export const createRoomRequest = async (): Promise<string | null> => {
  const userData = store.getState().user.data

  if (!userData) return null

  try {
    const { id } = await createRoom({ hostId: userData.id })
    store.dispatch(gameSlice.actions.setRoomId(id))
    Ws.connect(id, { id: userData.id, login: userData.login })
    Ws.onMessage = data => {
      store.dispatch(
        gameSlice.actions.setUsers((data as { users: UserInfo[] }).users)
      )
    }
    return id
  } catch (e) {
    console.error(e)
  }

  return null
}

export const updateRoomRequest = async (roomId: string): Promise<void> => {
  const userData = store.getState().user.data
  const gameData = store.getState().game

  if (!userData) return

  try {
    await updateRoomById(roomId, gameData)
  } catch (e) {
    console.error(e)
  }
}
