import { FC, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Cell } from '../../game/models/Cell'
import { useAppSelector } from '../../hooks/useApp'

type Props = {
  cell: Cell
  click: (cell: Cell) => void
}

export const CellComponent: FC<Props> = ({ cell, click }) => {
  const { zombies, players, items } = useAppSelector(state => state.game)

  const [isOpen, setIsOpen] = useState(false)

  const zombieOnCell = zombies.filter(z => z.cellId === cell.id)
  const itemsOnCell = items.filter(i => i.cellId === cell.id)
  const playersOnCell = players.filter(p => p.cellId === cell.id)

  const objectsOnCell = [
    ...zombieOnCell,
    ...itemsOnCell,
    ...playersOnCell.filter(p => !p.isZombie),
  ]

  const openedObjects = [
    ...zombieOnCell.filter(z => z.opened),
    ...itemsOnCell.filter(i => i.opened),
    ...playersOnCell.filter(p => !p.isZombie),
  ]

  const mouseOverHandler = () => {
    if (openedObjects.length > 1 && cell) {
      setIsOpen(true)
    }
  }

  const mouseLeaveHandler = () => {
    setIsOpen(false)
  }

  return (
    <CellBlock
      $isOpen={isOpen}
      onClick={() => click(cell)}
      onMouseOver={mouseOverHandler}
      onMouseLeave={mouseLeaveHandler}>
      <CellBlockCard $isOpen={isOpen}>
        {objectsOnCell.map(object => {
          const isPlayer = !('opened' in object)
          const isVisible = isPlayer || object.opened

          return (
            <CardWrapper $isOpen={isOpen} key={object.id}>
              <Card $isOpen={isOpen} $isPlayer={isPlayer}>
                {isVisible && (
                  <CardImage src={object.image} alt={object.name} />
                )}
              </Card>
            </CardWrapper>
          )
        })}
      </CellBlockCard>
      {cell.isTraversable && <Dot />}
    </CellBlock>
  )
}

const CellBlock = styled.div<{
  $isOpen?: boolean
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  transition: all 0.3s ease-in-out;
`

const CellBlockCard = styled.div<{
  $isOpen?: boolean
}>`
  transition: all 0.3s ease-in-out;
  ${props =>
    props.$isOpen &&
    css`
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 10px;
      z-index: 3;
      background-color: lightblue;
      padding: 10px;
      border-radius: 10px;
    `}
`

const CardWrapper = styled.div<{
  $isOpen?: boolean
}>`
  position: ${props => (props.$isOpen ? 'static' : 'absolute')};
  ${props =>
    !props.$isOpen &&
    css`
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `};
`

export const Card = styled.div<{
  $isOpen?: boolean
  $isPlayer?: boolean
  $animation?: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(255, 255, 192);
  width: 98px;
  height: 98px;
  border-radius: 20px;
  ${props =>
    props.$animation &&
    css`
      animation: ${ripple} 1s infinite ease-in-out;
    `}
  z-index: ${props => (props.$isPlayer ? '1' : '0')};
`

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`

const Dot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  z-index: 3;
`

const ripple = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
