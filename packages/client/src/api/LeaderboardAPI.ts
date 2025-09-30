import apiClient from './APIClient'

export type SimpleResponse = {
  response?: string
}

type SendLeaderboardRequest = {
  data: SendLeaderboardRequestData
  ratingFieldName: string
  teamName: string
}

export type SendLeaderboardRequestData = {
  [key: string]: number | string
  login: string
  zombiesKilled: number
  lootFound: number
  completions: number
  totalPoints: number
}

export type GetLeaderboardResponseData = {
  data: SendLeaderboardRequestData
}

export type GetLeaderboardRequest = {
  cursor: number
  limit: number
}

export type GetLeaderboardResponse = SimpleResponse &
  GetLeaderboardResponseData[]

const commonData: Omit<SendLeaderboardRequest, 'data'> = {
  ratingFieldName: 'totalPoints',
  teamName: 'popstarGames',
}

export const sendLeaderboardResults = async (
  data: SendLeaderboardRequestData
): Promise<SimpleResponse> => {
  const response = await apiClient.post<SimpleResponse>('/leaderboard', {
    ...commonData,
    data: data,
  })
  return response.data
}

export const getTeamLeaderboard = async (
  data: GetLeaderboardRequest
): Promise<GetLeaderboardResponseData[]> => {
  const response = await apiClient.post<GetLeaderboardResponse>(
    `/leaderboard/${commonData.teamName}`,
    {
      ...data,
      ratingFieldName: commonData.ratingFieldName,
    }
  )
  return response.data
}

export const getAllLeaderboard = async (
  data: GetLeaderboardRequest
): Promise<GetLeaderboardResponseData[]> => {
  const response = await apiClient.post<GetLeaderboardResponse>(
    `/leaderboard/all`,
    {
      ...data,
      ratingFieldName: commonData.ratingFieldName,
    }
  )
  return response.data
}
