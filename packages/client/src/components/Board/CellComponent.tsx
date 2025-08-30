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

  const mouseOverHandler = (cell: Cell) => {
    const zombieOnCell = zombies.filter(
      zombie => zombie.cellId === cell.id && zombie.opened
    )
    const itemsOnCell = items.filter(
      item => item.cellId === cell.id && item.opened
    )
    const playersOnCell = players.filter(player => player.cellId === cell.id)

    const objectsOnCell = [...zombieOnCell, ...itemsOnCell, ...playersOnCell]

    if (objectsOnCell.length > 1 && cell) {
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
      onMouseOver={() => mouseOverHandler(cell)}
      onMouseLeave={mouseLeaveHandler}>
      <CellBlockCard $isOpen={isOpen}>
        {items
          .filter(item => item.cellId === cell.id)
          .map(item => (
            <CardWrapper $isOpen={isOpen} key={item.id}>
              <Card $isOpen={isOpen}>
                {item.opened ? (
                  <CardImage src={item.image} alt={item.name} />
                ) : (
                  ''
                )}
              </Card>
            </CardWrapper>
          ))}
        {players
          .filter(player => player.cellId === cell.id && !player.isZombie)
          .map(player => (
            <CardWrapper $isOpen={isOpen} key={player.id}>
              <PlayerCard $isOpen={isOpen}>
                <CardImage src={player.image} alt={player.name} />
              </PlayerCard>
            </CardWrapper>
          ))}
        {zombies
          .filter(zombie => zombie.cellId === cell.id)
          .map(zombie => (
            <CardWrapper $isOpen={isOpen} key={zombie.id}>
              <Card $isOpen={isOpen}>
                {zombie.opened ? (
                  <CardImage src={zombie.image} alt={zombie.name} />
                ) : (
                  ''
                )}
              </Card>
            </CardWrapper>
          ))}
      </CellBlockCard>
      {cell.canMove && <Dot />}
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
`

export const CardImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
`

const PlayerCard = styled(Card)`
  z-index: 1;
  background-color: darkgray;
`

const Dot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  z-index: 2;
`

const ripple = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
