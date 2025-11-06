import { Helmet } from 'react-helmet'
import { BoardComponent } from '../components/Board/BoardComponent'
import { useEffect, useState } from 'react'
import { Hud } from '../components/HUD/HUD'
import { useAppDispatch, useAppSelector } from '../hooks/useApp'
import { gameSlice, GameType, startGame } from '../slices/gameSlice'
import { BarricadeDirectionSelector } from '../components/Game/BarricadeDirectionSelector'
import { WinDialog } from '../components/Game/WinDialog'
import { StartDialog } from '../components/Game/StartDialog'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Pinwheel } from '../components/Pinwheel/Pinwheel'
import { Box, makeStyles } from '@material-ui/core'
import { LobbyDialog } from '../components/Game/LobbyDialog'
import { connectToRoomRequest, createRoomRequest } from '../game/online'

const useStyles = makeStyles(theme => ({
  boardImage: {
    display: 'block',
    position: 'absolute',
    zIndex: 0,
    width: '1557px',
    aspectRatio: 1,
  },
  wrapper: {
    margin: '0 auto',
    maxWidth: '1557px',
    display: 'flex',
    flexDirection: 'column',
  },
}))

export const GamePage = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { players, currentPlayerIndex, status, isLobbyDialogOpen } =
    useAppSelector(state => state.game)

  const [isStartDialog, setIsStartDialog] = useState(true)
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const currentPlayer = players[currentPlayerIndex]

  const onPreStartGame = async (gameType: GameType, userRoomId?: string) => {
    setIsStartDialog(false)
    dispatch(gameSlice.actions.setGameType(gameType))
    if (gameType === 'online') {
      if (!userRoomId) {
        await createRoomRequest()
        dispatch(gameSlice.actions.setIsLobbyDialogOpen(true))
        return
      }
      dispatch(gameSlice.actions.setIsLobbyDialogOpen(true))
      await connectToRoomRequest(userRoomId)
      return
    }
    const scrollHeight = document.documentElement.scrollHeight
    window.scrollTo({ top: scrollHeight, left: 0, behavior: 'smooth' })
    dispatch(startGame())
  }

  const onStartGame = async () => {
    dispatch(gameSlice.actions.setIsLobbyDialogOpen(false))
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
  }, [dispatch, navigate, status])

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <main>
        <Box className={classes.wrapper}>
          <img
            className={classes.boardImage}
            src="/images/game/board.jpg"
            alt="board"
          />
          <BoardComponent />
          {currentPlayer && <Hud />}
          <Pinwheel />
          <BarricadeDirectionSelector />
        </Box>
        {portalRoot &&
          createPortal(
            <>
              <BarricadeDirectionSelector />
              <WinDialog />
              <StartDialog
                isDialog={isStartDialog}
                startGame={onPreStartGame}
              />
              <LobbyDialog
                isDialog={isLobbyDialogOpen}
                startGame={onStartGame}
              />
            </>,
            portalRoot
          )}
      </main>
    </>
  )
}

export const initGamePage = async () => {
  return Promise.resolve()
}
