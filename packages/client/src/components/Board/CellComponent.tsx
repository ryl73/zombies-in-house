import { FC } from 'react'
import styled from 'styled-components'
import { Cell } from '../../game/models/Cell'

type Props = {
  cell: Cell
  click: (cell: Cell) => void
}

export const CellComponent: FC<Props> = ({ cell, click }) => {
  return (
    <CellBlock
      $walls={cell.walls}
      $canMove={cell.canMove}
      onClick={() => click(cell)}>
      {cell.items.map(item => (
        <Card key={item.id}>{item.opened ? item.name : ''}</Card>
      ))}
      {cell.players.map(player => (
        <PlayerCard key={player.id}>{player.name}</PlayerCard>
      ))}
      {cell.zombie && (
        <Card key={cell.zombie.id}>
          {cell.zombie.opened ? cell.zombie.name : ''}
        </Card>
      )}
      {cell.canMove && <Dot />}
    </CellBlock>
  )
}

const CellBlock = styled.div<{
  $canMove?: boolean
  $walls?: { left: boolean; top: boolean; right: boolean; bottom: boolean }
}>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
`

const Card = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: gray;
  width: 98%;
  height: 98%;
  border-radius: 10px;
`

const PlayerCard = styled(Card)`
  z-index: 2;
  background-color: darkgray;
`

const Dot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: black;
  z-index: 1;
`
