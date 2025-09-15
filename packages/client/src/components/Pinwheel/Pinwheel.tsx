import { useState } from 'react'
import { motion } from 'motion/react'
import styled from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { manualSpinPinwheel } from '../../slices/gameSlice'
import { Button } from '../../styles/Buttons'

export const Pinwheel = () => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const dispatch = useAppDispatch()

  const { pinwheelResult, isPinwheelOpen } = useAppSelector(state => state.game)

  const spinArrow = () => {
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

    setRotation(spins)
  }

  const handleAnimationComplete = () => {
    if (isSpinning) {
      setIsSpinning(false)
      dispatch(manualSpinPinwheel())
      setRotation(0)
    }
  }

  return (
    <PinwheelOverlay $isOpen={isPinwheelOpen}>
      <PinwheelWrapper>
        <PinwheelContainer>
          <PinwheelImg src="/src/assets/spinwheel.png" alt="spin wheel" />
          <Arrow
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: 'easeOut' }}
            onAnimationComplete={handleAnimationComplete}>
            <ArrowImg src="/src/assets/spinner-arrow.png" alt="spin arrow" />
          </Arrow>
        </PinwheelContainer>

        <SpinButton onClick={spinArrow} disabled={isSpinning}>
          Spin
        </SpinButton>
      </PinwheelWrapper>
    </PinwheelOverlay>
  )
}

const PinwheelOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`

const PinwheelWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
`

const PinwheelContainer = styled.div`
  position: relative;
`

const PinwheelImg = styled.img`
  width: 1000px;
`

const Arrow = styled(motion.div)`
  position: absolute;
  width: 120px;
  height: 160px;
  top: calc(50% - 160px);
  left: calc(50% - 60px);
  transform-origin: bottom center;
`

const ArrowImg = styled.img`
  width: 120px;
  height: 160px;
`

const SpinButton = styled(Button)`
  min-width: 160px;
  cursor: pointer;

  &:hover {
    filter: brightness(0.9);
    transition: 0.2s ease;
  }
`
