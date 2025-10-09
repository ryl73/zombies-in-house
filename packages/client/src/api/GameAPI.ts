import { api } from './API'
import { GameState } from '../slices/gameSlice'

export type SimpleResponse = {
  response?: string
}

export type CreateRoomRequest = {
  hostId: number
  state: GameState
}

export type CreateRoomResponse = {
  id: string
} & SimpleResponse

export const createRoom = async (
  data: CreateRoomRequest
): Promise<CreateRoomResponse> => {
  const response = await api.post<CreateRoomResponse>('/room', data)
  return response.data
}
