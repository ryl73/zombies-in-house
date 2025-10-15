import { api } from './API'
import { GameState } from '../slices/gameSlice'

export type SimpleResponse = {
  response?: string
}

export type CreateRoomRequest = {
  hostId: number
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

export const updateRoomById = async (
  id: string,
  data: GameState
): Promise<CreateRoomResponse> => {
  const response = await api.post<CreateRoomResponse>(`/room/${id}`, data)
  return response.data
}
