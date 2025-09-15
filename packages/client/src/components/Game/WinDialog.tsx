import { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { Link } from 'react-router-dom'
import { gameSlice } from '../../slices/gameSlice'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core'

export const WinDialog: FC = () => {
  const dispatch = useAppDispatch()
  const { isWinDialogOpen, winningPlayerId, players } = useAppSelector(
    state => state.game
  )

  const winningPlayer = players.find(p => p.id === winningPlayerId)

  const handleConfirm = () => {
    dispatch(gameSlice.actions.confirmWin())
  }

  const handleCancel = () => {
    dispatch(gameSlice.actions.closeWinDialog())
  }

  return (
    <Dialog open={isWinDialogOpen}>
      <DialogTitle>Победа!</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          {winningPlayer?.name}, вы хотите уехать на машине?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          component={Link}
          to={`/game-end`}
          variant="text"
          color="primary"
          size="large"
          onClick={handleConfirm}>
          Да, уехать
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleCancel}>
          Остаться
        </Button>
      </DialogActions>
    </Dialog>
  )
}
