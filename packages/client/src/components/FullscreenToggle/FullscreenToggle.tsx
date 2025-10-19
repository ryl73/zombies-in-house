import React from 'react'
import { Box, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@material-ui/icons'
import { useFullscreen } from '../../hooks/useFullscreen'

interface FullscreenToggleProps {
  element?: HTMLElement
}

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'fixed',
    top: 0,
    right: 0,
  },
  errorWrapper: {
    position: 'fixed',
    bottom: theme.spacing(2.5),
    right: theme.spacing(2.5),
    backgroundColor: '#f44336',
    color: 'white',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0.5),
    zIndex: 9999,
  },
  iconButton: {
    color: 'var(--text-white)',
  },
}))

export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  element,
}: FullscreenToggleProps) => {
  const classes = useStyles()
  const { isFullscreen, isSupported, error, toggleFullscreen } = useFullscreen()

  if (!isSupported) {
    return null
  }

  const handleClick = () => {
    toggleFullscreen(element)
  }

  return (
    <Box className={classes.wrapper}>
      <Tooltip
        title={
          isFullscreen
            ? 'Выйти из полноэкранного режима'
            : 'Полноэкранный режим'
        }>
        <IconButton
          onClick={handleClick}
          size="medium"
          className={classes.iconButton}>
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>
      {error && <Box className={classes.errorWrapper}>{error}</Box>}
    </Box>
  )
}
