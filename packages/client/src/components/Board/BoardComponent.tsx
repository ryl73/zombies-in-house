import { FC, Fragment, useState } from 'react'
import styled from 'styled-components'
import { CellComponent } from './CellComponent'
import { Cell } from '../../game/models/Cell'
import Game from '../../game/engine/Game'
import Zombie from '../../game/models/Zombie'
import { Player } from '../../game/models/Player'

type Props = {
  game: Game
}

export const BoardComponent: FC<Props> = ({ game }) => {
  const [isZombieMove, setIsZombieMove] = useState<boolean>(false)

  const handleClick = async (cell: Cell) => {
    const currentPlayer = game.players[game.currentPlayerIndex]

    if (currentPlayer.isZombie) {
      if (cell.zombie && cell.zombie.opened && !isZombieMove) {
        currentPlayer.cell = cell
        setIsZombieMove(true)
        await game.moveStage()
      } else {
        if (!cell.canMove) return

        setIsZombieMove(false)
        const playerZombie = currentPlayer.cell?.zombie
        if (playerZombie) {
          currentPlayer.cell?.moveZombie(playerZombie, cell)
          await game.endTurn()
        }
      }
    } else {
      if (!cell.canMove) return

      currentPlayer.cell?.movePlayer(currentPlayer, cell)

      if (cell.zombie) {
        cell.zombie.opened = true
        if (currentPlayer.items.find(item => item.type === 'grenade')) {
          game.canFight = 'grenade'
          return
        }

        if (
          currentPlayer.items.find(item => item.type === 'launcher') &&
          cell.zombie.type === 'boss'
        ) {
          game.canFight = 'launcher'
          return
        }
        const fightStatus = await game.fightStage()

        if (fightStatus === 'win') {
          if (cell.items.length > 0) {
            for (const item of cell.items) {
              if (item.type === 'key' && item.cell?.type === 'car') {
                continue
              }
              currentPlayer.pickItem(item)
              cell.removeItem(item)
            }
          }
        }
        return
      }

      if (cell.items.length > 0) {
        for (const item of cell.items) {
          if (item.type === 'key' && item.cell?.type === 'car') {
            continue
          }
          currentPlayer.pickItem(item)
          cell.removeItem(item)
        }
      }

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

      await game.endTurn()
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
  padding: 174px 0 0 167px;
`
