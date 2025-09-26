import React from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { gameSlice } from '../../slices/gameSlice'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  directions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  directionButton: {
    padding: '10px 20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    background: '#f0f0f0',
    cursor: 'pointer',
    color: '#0B1727',

    '&:hover': {
      background: '#e0e0e0',
    },
  },
}))

export const BarricadeDirectionSelector: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const { barricadeSelection, isAwaitingBarricadeDirection } = useAppSelector(
    state => state.game
  )

  const handleSelect = (direction: string) => {
    dispatch(gameSlice.actions.selectBarricadeDirection(direction))
  }

  const handleCancel = () => {
    dispatch(gameSlice.actions.cancelBarricadeSelection())
  }

  const directionLabels: Record<string, string> = {
    top: 'Верх',
    right: 'Право',
    bottom: 'Низ',
    left: 'Лево',
  }

  return (
    <Dialog open={isAwaitingBarricadeDirection && !!barricadeSelection}>
      <DialogTitle>Выберите направление для баррикады</DialogTitle>
      <DialogContent>
        <Box className={classes.directions}>
          {barricadeSelection?.availableDirections.map(dir => (
            <Button
              key={dir}
              className={classes.directionButton}
              onClick={() => handleSelect(dir)}>
              {directionLabels[dir] || dir}
            </Button>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="primary"
          size="large"
          onClick={handleCancel}>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  )
}
