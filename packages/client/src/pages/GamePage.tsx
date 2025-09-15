import { Helmet } from 'react-helmet'
import { BoardComponent } from '../components/Board/BoardComponent'
import { useEffect, useState } from 'react'
import { Hud } from '../components/HUD/HUD'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import styled from 'styled-components'
import { startGame } from '../slices/gameSlice'
import { BarricadeDirectionSelector } from '../components/Game/BarricadeDirectionSelector'
import { WinDialog } from '../components/Game/WinDialog'
import { StartDialog } from '../components/Game/StartDialog'
import { createPortal } from 'react-dom'

export const GamePage = () => {
  const dispatch = useAppDispatch()
  const { players, currentPlayerIndex } = useAppSelector(state => state.game)

  const [isDialog, setIsDialog] = useState(true)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const currentPlayer = players[currentPlayerIndex]

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  const onStartGame = () => {
    setIsDialog(false)
    const scrollHeight = document.documentElement.scrollHeight
    window.scrollTo({ top: scrollHeight, left: 0, behavior: 'smooth' })
    dispatch(startGame())
  }

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
          <BoardComponent />
          {currentPlayer && <Hud />}
        </Wrapper>
        {portalRoot &&
          createPortal(
            <>
              <BarricadeDirectionSelector />
              <WinDialog />
              <StartDialog isDialog={isDialog} startGame={onStartGame} />
            </>,
            portalRoot
          )}
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
