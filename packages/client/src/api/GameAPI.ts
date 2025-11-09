import { api } from './API'
import { GameState } from '../slices/gameSlice'

export type SimpleResponse = {
  response?: string
}

export type CreateRoomResponse = {
  id: string
} & SimpleResponse

export type GetRoomResponse = GameState & {
  id: string
  hostId: number
} & SimpleResponse

export const createRoom = async (): Promise<CreateRoomResponse> => {
  const response = await api.post<CreateRoomResponse>('/room')
  return response.data
}

export const updateRoomById = async (
  id: string,
  data: GameState
): Promise<CreateRoomResponse> => {
  const response = await api.post<CreateRoomResponse>(`/room/${id}`, data)
  return response.data
}

export const getRoomById = async (id: string): Promise<GetRoomResponse> => {
  const response = await api.get<GetRoomResponse>(`/room/${id}`)
  return response.data
}
