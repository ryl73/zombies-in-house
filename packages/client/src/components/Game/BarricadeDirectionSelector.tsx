import React from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { gameSlice } from '../../slices/gameSlice'
import styled from 'styled-components'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'

export const BarricadeDirectionSelector: React.FC = () => {
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
        <Directions>
          {barricadeSelection?.availableDirections.map(dir => (
            <DirectionButton key={dir} onClick={() => handleSelect(dir)}>
              {directionLabels[dir] || dir}
            </DirectionButton>
          ))}
        </Directions>
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

const Directions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`

const DirectionButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #f0f0f0;
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`
