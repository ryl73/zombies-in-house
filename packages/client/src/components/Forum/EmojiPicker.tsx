import React, { useState } from 'react'
import { Popover, Box, IconButton, Paper } from '@material-ui/core'
import { InsertEmoticon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    maxWidth: 300,
  },
  emojiButton: {
    fontSize: '1.5rem',
    minWidth: 'auto',
    padding: theme.spacing(1),
    color: 'rgba(0,0,0,0.8)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      transform: 'scale(1.2)',
    },
  },
  chooseEmojiButton: {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
  disabled: {
    pointerEvents: 'none',
    opacity: 0.5,
  },
}))

const EMOJI_SET = ['👍', '👎', '❤️', '😄', '😮', '🔥']

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  disabled?: boolean
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelect,
  disabled = false,
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget)
    }
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji)
    handleClose()
  }

  const open = Boolean(anchorEl)

  return (
    <>
      <IconButton
        className={classes.chooseEmojiButton}
        onClick={handleOpen}
        size="small"
        disabled={disabled}>
        <InsertEmoticon />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}>
        <Paper>
          <Box className={classes.emojiGrid}>
            {EMOJI_SET.map(emoji => (
              <IconButton
                key={emoji}
                className={classes.emojiButton}
                onClick={() => handleEmojiClick(emoji)}>
                {emoji}
              </IconButton>
            ))}
          </Box>
        </Paper>
      </Popover>
    </>
  )
}
