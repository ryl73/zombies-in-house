import React from 'react'
import { IconButton, Tooltip } from '@material-ui/core'
import {
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@material-ui/icons'
import { useFullscreen } from '../../hooks/useFullscreen'
import styled from 'styled-components'

interface FullscreenToggleProps {
  element?: HTMLElement
}

export const FullscreenToggle: React.FC<FullscreenToggleProps> = ({
  element,
}: FullscreenToggleProps) => {
  const { isFullscreen, isSupported, error, toggleFullscreen } = useFullscreen()

  if (!isSupported) {
    return null
  }

  const handleClick = () => {
    toggleFullscreen(element)
  }

  return (
    <Wrapper>
      <Tooltip
        title={
          isFullscreen
            ? 'Выйти из полноэкранного режима'
            : 'Полноэкранный режим'
        }>
        <IconButton onClick={handleClick} color="inherit" size="medium">
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Tooltip>

      {error && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#f44336',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 4,
            zIndex: 9999,
          }}>
          {error}
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
`
