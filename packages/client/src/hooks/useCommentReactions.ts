import { useState, useEffect, useCallback } from 'react'
import { forumAPI } from '../api/forumAPI'
import { ReactionStats } from '../types/forum'

interface UseCommentReactionsProps {
  commentId: number
  currentUser: string
  initialReactions?: ReactionStats
}

export const useCommentReactions = ({
  commentId,
  currentUser,
  initialReactions = {},
}: UseCommentReactionsProps) => {
  const [reactions, setReactions] = useState<ReactionStats>(initialReactions)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadReactions = async () => {
      try {
        const response = await forumAPI.getCommentReactions(commentId)
        if (response.success) {
          setReactions(response.data)
        }
      } catch (err) {
        console.error('Error loading reactions:', err)
      }
    }

    loadReactions()
  }, [commentId])

  const handleReactionClick = useCallback(
    async (emoji: string) => {
      setError(null)

      const previousReactions = { ...reactions }
      const updatedReactions = { ...reactions }

      if (updatedReactions[emoji]?.includes(currentUser)) {
        updatedReactions[emoji] = updatedReactions[emoji].filter(
          user => user !== currentUser
        )
        if (updatedReactions[emoji].length === 0) {
          delete updatedReactions[emoji]
        }
      } else {
        updatedReactions[emoji] = [
          ...(updatedReactions[emoji] || []),
          currentUser,
        ]
      }

      setReactions(updatedReactions)

      try {
        const response = await forumAPI.toggleReaction(
          commentId,
          emoji,
          currentUser
        )

        if (!response.success) {
          setReactions(previousReactions)
          setError(response.message || 'Ошибка при обновлении реакции')
        }
      } catch (err) {
        setReactions(previousReactions)
        setError('Ошибка при обновлении реакции')
      }
    },
    [commentId, currentUser, reactions]
  )

  const userReactions = Object.keys(reactions).filter(emoji =>
    reactions[emoji].includes(currentUser)
  )

  return {
    reactions,
    userReactions,
    error,
    handleReactionClick,
  }
}
