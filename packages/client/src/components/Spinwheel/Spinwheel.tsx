import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import styled from 'styled-components'
import { useAppSelector } from '../../hooks/useApp'

type Props = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const SpinWheel = ({ isOpen, onOpen, onClose }: Props) => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  const { moveCount } = useAppSelector(state => state.game)

  const spinArrow = () => {
    if (isSpinning) return
    setIsSpinning(true)

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
      onClose()
      setRotation(0)
    }
  }

  useEffect(() => {
    onOpen()
  }, [moveCount])

  return (
    <WheelWrapper $isOpen={isOpen}>
      <WheelContainer>
        <Wheel>
          <WheelImg src="/src/assets/spinwheel.png" alt="spin wheel" />
          <Arrow
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: 'easeOut' }}
            onAnimationComplete={handleAnimationComplete}>
            <ArrowImg src="/src/assets/spinner-arrow.png" alt="spin arrow" />
          </Arrow>
        </Wheel>

        <SpinButton onClick={spinArrow} disabled={isSpinning}>
          Spin
        </SpinButton>
      </WheelContainer>
    </WheelWrapper>
  )
}

const WheelWrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`

const WheelContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
`

const Wheel = styled.div`
  position: relative;
`

const WheelImg = styled.img`
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

const SpinButton = styled.button`
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
  }
`
