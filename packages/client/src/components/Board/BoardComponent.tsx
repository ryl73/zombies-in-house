import { FC, Fragment } from 'react'
import styled from 'styled-components'
import { CellComponent } from './CellComponent'
import { Cell } from '../../game/models/Cell'
import Game from '../../game/engine/Game'

type Props = {
  game: Game
}

export const BoardComponent: FC<Props> = ({ game }) => {
  const handleClick = (cell: Cell) => {
    const currentPlayer = game.players[game.currentPlayerIndex]
    if (currentPlayer.isZombie) {
      if (cell.zombie && cell.zombie.opened) {
        currentPlayer.cell = cell
        game.moveStage()
      }
    } else {
      if (!cell.canMove) return

      if (!cell.empty) {
        currentPlayer.cell?.movePlayer(currentPlayer, cell)
        if (cell.zombie) {
          cell.zombie.opened = true
          game.fightStage()
        }
        if (cell.items.length > 0) {
          cell.items.forEach(item => {
            currentPlayer.pickItem(item)
          })
          cell.removeAllItems()
          game.endTurn()
        }
      } else {
        currentPlayer.cell?.movePlayer(currentPlayer, cell)
        if (cell.type === 'car') {
          const keyOrGasoline = currentPlayer.items.filter(
            item => item.type === 'key' || item.type === 'gasoline'
          )
          if (keyOrGasoline.length > 0) {
            keyOrGasoline.forEach(item => {
              item.cell = cell
              cell.addItem(item)
              currentPlayer.useItem(item)
            })
          }
        }
        game.endTurn()
      }
    }
  }

  return (
    <Grid>
      {game.board.cells.map((row, index) => (
        <Fragment key={index}>
          {row.map(cell => (
            <CellComponent cell={cell} key={cell.id} click={handleClick} />
          ))}
        </Fragment>
      ))}
    </Grid>
  )
}

const Grid = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  border-collapse: collapse;
  grid-template-columns: repeat(12, 100px);
  gap: 2px;
  padding: 174px 0 174px 167px;
`
