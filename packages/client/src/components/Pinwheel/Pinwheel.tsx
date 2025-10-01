import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'motion/react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { resolvePinwheel } from '../../slices/gameSlice'
import { Box, Container, makeStyles } from '@material-ui/core'

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
  const classes = useStyles()
  const [isSpinning, setIsSpinning] = useState(false)
  const controls = useAnimation()
  const dispatch = useAppDispatch()

  const { pinwheelResult, isPinwheelOpen } = useAppSelector(state => state.game)

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
        <Box className={classes.pinwheelContainer}>
          <img
            src="/src/assets/spinwheel.webp"
            className={classes.pinwheelImg}
            alt="spin wheel"
          />
          <Arrow
            animate={controls}
            onAnimationComplete={handleAnimationComplete}>
            <img
              src="/src/assets/spinner-arrow.webp"
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

const Arrow = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 120px;
  top: calc(50% - 120px);
  left: calc(50% - 27px);
  transform-origin: bottom center;
`
