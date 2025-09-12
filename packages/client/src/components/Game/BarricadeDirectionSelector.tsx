import React from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { gameSlice } from '../../slices/gameSlice'
import styled from 'styled-components'

export const BarricadeDirectionSelector: React.FC = () => {
  const dispatch = useAppDispatch()
  const { barricadeSelection, isAwaitingBarricadeDirection } = useAppSelector(
    state => state.game
  )

  if (!isAwaitingBarricadeDirection || !barricadeSelection) {
    return null
  }

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
    <Overlay>
      <Content>
        <Title>Выберите направление для баррикады</Title>
        <Directions>
          {barricadeSelection.availableDirections.map(dir => (
            <DirectionButton key={dir} onClick={() => handleSelect(dir)}>
              {directionLabels[dir] || dir}
            </DirectionButton>
          ))}
        </Directions>
        <CancelButton onClick={handleCancel}>Отмена</CancelButton>
      </Content>
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

const Content = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fffbca;
`

const Title = styled.h3`
  margin-bottom: 20px;
  color: #0b1727;
`

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

const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #ffcccc;
  cursor: pointer;

  &:hover {
    background: #ffbbbb;
  }
`
