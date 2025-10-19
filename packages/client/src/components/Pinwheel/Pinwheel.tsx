import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'motion/react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { getCurrentPlayer, resolvePinwheel } from '../../slices/gameSlice'
import { Box, Container, makeStyles } from '@material-ui/core'
import spinArrow from '../../assets/spinner-arrow.webp'
import { ThemeMode, useThemeSwitcher } from '../../theme/ThemeContext'
import { themeManager } from '../../theme/ThemeManager'

const useStyles = makeStyles(theme => ({
  pinwheelWrapper: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000,
  },
  action: {
    backgroundColor: theme.palette.background.default,
    borderRadius: '8px',
    padding: '16px 12px',
    color: theme.palette.text.primary,
  },
  pinwheelContainer: {
    position: 'relative',
  },
  pinwheelImg: {
    width: '1000px',
  },
  arrowImg: {
    width: '60px',
    height: '120px',
  },
}))

export const Pinwheel = () => {
  const { mode } = useThemeSwitcher()
  const classes = useStyles()
  const [isSpinning, setIsSpinning] = useState(false)
  const controls = useAnimation()
  const dispatch = useAppDispatch()
  const assets = themeManager.getAssets()

  const { pinwheelResult, isPinwheelOpen, stage } = useAppSelector(
    state => state.game
  )
  const player = useAppSelector(state => getCurrentPlayer(state.game))
  const name = player?.name ?? ''

  const handleAnimationComplete = () => {
    if (isSpinning) {
      setIsSpinning(false)
      dispatch(resolvePinwheel())
    }
  }

  useEffect(() => {
    const spinArrow = async () => {
      if (!pinwheelResult) return
      if (isSpinning) return

      setIsSpinning(true)

      const { moveCount } = pinwheelResult
      const segmentAngle = 90

      const minAngle = (moveCount - 1) * segmentAngle
      const maxAngle = moveCount * segmentAngle
      const randomOffset = Math.random() * (maxAngle - minAngle)
      const spins =
        360 * (3 + Math.floor(Math.random() * 3)) + minAngle + randomOffset

      await controls.start({
        rotate: spins,
        transition: { duration: 3, ease: 'easeOut' },
      })
    }

    if (isPinwheelOpen) {
      controls.set({ rotate: 0 })
      spinArrow()
    }
  }, [controls, isPinwheelOpen, isSpinning, pinwheelResult])

  return (
    <PinwheelOverlay
      $isOpen={isPinwheelOpen}
      initial={{ opacity: 0 }}
      animate={{ opacity: isPinwheelOpen ? 1 : 0 }}
      transition={{ duration: 0.4 }}>
      <Container className={classes.pinwheelWrapper}>
        <Box className={classes.action}>{`${name}: ${
          stage === 'move' ? 'перемещение' : 'бой'
        }`}</Box>
        <Box className={classes.pinwheelContainer}>
          <img
            src={assets.spinwheel}
            className={classes.pinwheelImg}
            alt="spinwheel"
          />
          <Arrow
            $mode={mode}
            animate={controls}
            onAnimationComplete={handleAnimationComplete}>
            <img
              src={`${spinArrow}`}
              className={classes.arrowImg}
              alt="spin arrow"
            />
          </Arrow>
        </Box>
      </Container>
    </PinwheelOverlay>
  )
}

const PinwheelOverlay = styled(motion.div)<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`

const Arrow = styled(motion.div)<{ $mode: ThemeMode }>`
  position: absolute;
  width: 60px;
  height: 120px;
  top: ${({ $mode }) =>
    $mode === 'halloween' ? 'calc(50% - 125px)' : 'calc(50% - 115px)'};
  left: ${({ $mode }) =>
    $mode === 'halloween' ? 'calc(50% - 32px)' : 'calc(50% - 29px)'};
  transform-origin: bottom center;
`
