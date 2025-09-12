import React from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { gameSlice } from '../../slices/gameSlice'
import styled from 'styled-components'

export const WinDialog: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isWinDialogOpen, winningPlayerId, players } = useAppSelector(
    state => state.game
  )

  if (!isWinDialogOpen) {
    return null
  }

  const winningPlayer = players.find(p => p.id === winningPlayerId)

  const handleConfirm = () => {
    dispatch(gameSlice.actions.confirmWin())
  }

  const handleCancel = () => {
    dispatch(gameSlice.actions.closeWinDialog())
  }

  return (
    <Overlay>
      <Dialog>
        <h2>Победа!</h2>
        <p>{winningPlayer?.name}, вы хотите уехать на машине?</p>
        <div>
          <Button onClick={handleConfirm}>Да, уехать</Button>
          <Button onClick={handleCancel}>Остаться</Button>
        </div>
      </Dialog>
    </Overlay>
  )
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(45, 57, 73, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const Dialog = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #0b1727;
  background: #fffbca;
`

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`
