import { ReactionStats, ApiResponse } from '../types/forum'

// Моковая "база данных", пока у нас нет настоящей
const mockReactionsDB: { [commentId: number]: ReactionStats } = {
  1: { '👍': ['ryl73', 'andreissh'], '❤️': ['cyperus-papyrus'] },
  2: { '🔥': ['andreissh', 'cyperus-papyrus'] },
  3: { '👍': ['MarsiKris76'] },
}

export const forumAPI = {
  async getCommentReactions(
    commentId: number
  ): Promise<ApiResponse<ReactionStats>> {
    try {
      const reactions = mockReactionsDB[commentId] || {}

      return {
        data: reactions,
        success: true,
      }
    } catch (error) {
      return {
        data: {},
        success: false,
        message: 'Ошибка при загрузке реакций',
      }
    }
  },

  async toggleReaction(
    commentId: number,
    emoji: string,
    userId: string
  ): Promise<ApiResponse<ReactionStats>> {
    try {
      if (!mockReactionsDB[commentId]) {
        mockReactionsDB[commentId] = {}
      }

      const currentReactions = { ...mockReactionsDB[commentId] }

      if (currentReactions[emoji]) {
        const userIndex = currentReactions[emoji].indexOf(userId)
        if (userIndex > -1) {
          currentReactions[emoji] = [
            ...currentReactions[emoji].slice(0, userIndex),
            ...currentReactions[emoji].slice(userIndex + 1),
          ]
          if (currentReactions[emoji].length === 0) {
            delete currentReactions[emoji]
          }
        } else {
          currentReactions[emoji] = [...currentReactions[emoji], userId]
        }
      } else {
        currentReactions[emoji] = [userId]
      }

      mockReactionsDB[commentId] = currentReactions

      return {
        data: { ...currentReactions },
        success: true,
      }
    } catch (error) {
      return {
        data: {},
        success: false,
        message: 'Ошибка при обновлении реакции',
      }
    }
  },
}
