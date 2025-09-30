import { Helmet } from 'react-helmet'
import { BoardComponent } from '../components/Board/BoardComponent'
import { useEffect, useState } from 'react'
import { Hud } from '../components/HUD/HUD'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import styled from 'styled-components'
import { gameSlice, GameType, startGame } from '../slices/gameSlice'
import { BarricadeDirectionSelector } from '../components/Game/BarricadeDirectionSelector'
import { WinDialog } from '../components/Game/WinDialog'
import { StartDialog } from '../components/Game/StartDialog'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Pinwheel } from '../components/Pinwheel/Pinwheel'

export const GamePage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { players, currentPlayerIndex, status } = useAppSelector(
    state => state.game
  )

  const [isDialog, setIsDialog] = useState(true)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const currentPlayer = players[currentPlayerIndex]

  const onStartGame = (gameType: GameType, roomId?: string) => {
    setIsDialog(false)
    const scrollHeight = document.documentElement.scrollHeight
    window.scrollTo({ top: scrollHeight, left: 0, behavior: 'smooth' })
    dispatch(gameSlice.actions.setGameType(gameType))
    dispatch(startGame())
  }

  useEffect(() => {
    setPortalRoot(document.body)
  }, [])

  useEffect(() => {
    if (status === 'lost') {
      navigate('/game-end')
      dispatch(gameSlice.actions.setGameStatus('idle'))
    }
  }, [status])

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
          <Pinwheel />
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
