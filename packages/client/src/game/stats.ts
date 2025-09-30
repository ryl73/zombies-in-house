import {
  getAllLeaderboard,
  sendLeaderboardResults,
} from '../api/LeaderboardAPI'
import { GameStatistics } from '../slices/gameSlice'
import { User } from '../slices/userSlice'

type FieldType = 'zombiesKilled' | 'lootFound' | 'completions'

const pointsMap: Record<FieldType, number> = {
  zombiesKilled: 3,
  lootFound: 1,
  completions: 10,
}

export const sendStats = async (
  field: FieldType,
  statistic: GameStatistics,
  userData: User | null
) => {
  if (!userData) return

  try {
    const teamLeaderboard = await getAllLeaderboard({ limit: 100, cursor: 0 })
    const currentStatistics = teamLeaderboard.find(
      l => l.data.login === userData.login
    )
    if (!currentStatistics) {
      await sendLeaderboardResults({
        ...statistic,
        totalPoints: pointsMap[field],
        [field]: 1,
        login: userData.login,
      })
      return
    }

    const newStatistics = {
      ...currentStatistics.data,
      totalPoints: currentStatistics.data.totalPoints + pointsMap[field],
      [field]: Number(currentStatistics.data[field]) + 1,
    }

    await sendLeaderboardResults({
      ...newStatistics,
      login: userData.login,
    })
  } catch (e) {
    console.log(e)
  }
}
