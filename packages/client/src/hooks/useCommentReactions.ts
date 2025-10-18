import { useState, useEffect, useCallback, useMemo } from 'react'
import { forumAPI } from '../api/forumAPI'
import { useAppSelector } from './useApp'
import { selectUser } from '../slices/userSlice'
import { Reaction } from '../types/forum'

interface UseCommentReactionsProps {
  commentId: string
}

export const useCommentReactions = ({
  commentId,
}: UseCommentReactionsProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const currentUser = useAppSelector(selectUser)

  const loadReactions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await forumAPI.getCommentReactions(commentId)
      if (response.success && response.data) {
        setReactions(response.data)
      } else {
        setError(response.message || 'Ошибка загрузки реакций')
      }
    } catch (err) {
      setError('Ошибка загрузки реакций')
    } finally {
      setLoading(false)
    }
  }, [commentId])

  useEffect(() => {
    loadReactions()
  }, [loadReactions])

  const handleReactionClick = useCallback(
    async (emoji: string) => {
      if (!currentUser) {
        setError('Необходимо авторизоваться')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const existingReaction = reactions.find(
          reaction =>
            reaction.code === emoji &&
            reaction.authorLogin === currentUser.login
        )

        if (existingReaction) {
          await forumAPI.deleteReaction(existingReaction.id)
        } else {
          await forumAPI.addReaction(commentId, emoji)
        }

        await loadReactions()
      } catch (err) {
        setError('Ошибка при обновлении реакции')
      } finally {
        setLoading(false)
      }
    },
    [commentId, reactions, currentUser, loadReactions]
  )

  const reactionStats = useMemo(() => {
    const stats: { [emoji: string]: string[] } = {}
    reactions.forEach(reaction => {
      if (!stats[reaction.code]) {
        stats[reaction.code] = []
      }
      stats[reaction.code].push(reaction.authorLogin)
    })
    return stats
  }, [reactions])

  return {
    reactions: reactionStats,
    error,
    loading,
    handleReactionClick,
  }
}
