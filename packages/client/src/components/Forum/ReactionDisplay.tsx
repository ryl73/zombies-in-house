import React from 'react'
import { Chip, Box, Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ReactionStats } from '../../types/forum'

const useStyles = makeStyles(theme => ({
  reactionChip: {
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  selectedReaction: {
    backgroundColor: theme.palette.primary.light,
    border: `1px solid ${theme.palette.primary.light}`,
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.6,
  },
}))

interface ReactionDisplayProps {
  reactions: ReactionStats
  onReactionClick: (emoji: string) => void
  userReactions?: string[]
  disabled?: boolean
}

export const ReactionDisplay: React.FC<ReactionDisplayProps> = ({
  reactions,
  onReactionClick,
  userReactions = [],
  disabled = false,
}) => {
  const classes = useStyles()

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center">
      {Object.entries(reactions).map(([emoji, users]) => (
        <Tooltip key={emoji} title={users.join(', ')}>
          <Chip
            icon={<span>{emoji}</span>}
            label={users.length}
            clickable
            className={`${classes.reactionChip} ${
              userReactions.includes(emoji) ? classes.selectedReaction : ''
            } ${disabled ? classes.disabled : ''}`}
            onClick={() => !disabled && onReactionClick(emoji)}
            size="small"
          />
        </Tooltip>
      ))}
    </Box>
  )
}
