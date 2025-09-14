import { Helmet } from 'react-helmet'
import { BoardComponent } from '../components/Board/BoardComponent'
import { useEffect, useState } from 'react'
import { Hud } from '../components/HUD/HUD'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import styled from 'styled-components'
import { startGame } from '../slices/gameSlice'
import { SpinWheel } from '../components/Spinwheel/Spinwheel'

export const GamePage = () => {
  const dispatch = useAppDispatch()
  const [isSpinwheelOpen, setIsSpinwheelOpen] = useState(false)

  const { players, currentPlayerIndex } = useAppSelector(state => state.game)

  const currentPlayer = players[currentPlayerIndex]

  const closeSpinwheel = () => {
    setIsSpinwheelOpen(false)
  }

  const openSpinwheel = () => {
    setIsSpinwheelOpen(true)
  }

  useEffect(() => {
    dispatch(startGame())
  }, [dispatch])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <main>
        <Wrapper>
          <BoardImage src="/images/game/board.jpg" alt="board" />
          <BoardComponent onOpenSpinwheel={openSpinwheel} />
          {currentPlayer && <Hud />}
          <SpinWheel
            isOpen={isSpinwheelOpen}
            onOpen={openSpinwheel}
            onClose={closeSpinwheel}
          />
        </Wrapper>
      </main>
    </>
  )
}

const BoardImage = styled.img`
  display: block;
  position: absolute;
  z-index: 0;
  width: 1557px;
  aspect-ratio: 1;
`

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1557px;
  display: flex;
  flex-direction: column;
`

export const initGamePage = async () => {
  return Promise.resolve()
}
