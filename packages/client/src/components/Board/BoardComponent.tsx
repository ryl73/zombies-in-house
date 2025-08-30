import { Fragment, useState } from 'react'
import styled from 'styled-components'
import { CellComponent } from './CellComponent'
import { Cell } from '../../game/models/Cell'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import {
  endTurn,
  fightStage,
  movePlayer,
  moveStage,
  moveZombie,
  pickItem,
  setCanFight,
  setCurrentPlayerIndex,
  setItemCell,
  setPlayerCell,
  setZombieOpen,
  useItem,
} from '../../slices/gameSlice'

export const BoardComponent = () => {
  const dispatch = useAppDispatch()

  const { board, players, currentPlayerIndex, zombies, items } = useAppSelector(
    state => state.game
  )

  const currentPlayer = players[currentPlayerIndex]

  const [isZombieMove, setIsZombieMove] = useState<boolean>(false)

  const handleClick = async (cell: Cell) => {
    const zombieOnCell = zombies.find(zombie => zombie.cellId === cell.id)
    const itemsOnCell = items.filter(item => item.cellId === cell.id)
    const playersOnCell = players.filter(player => player.cellId === cell.id)

    if (currentPlayer.isZombie) {
      if (zombieOnCell && zombieOnCell.opened && !isZombieMove) {
        dispatch(setPlayerCell(cell.id))
        setIsZombieMove(true)
        await dispatch(moveStage())
      } else {
        if (!cell.canMove) return

        setIsZombieMove(false)
        dispatch(moveZombie(cell.id))
        if (playersOnCell.length > 0) {
          const playerOnCellIndex = players.findIndex(
            player => player.id === playersOnCell[0].id
          )
          if (playerOnCellIndex !== -1) {
            dispatch(setCurrentPlayerIndex(playerOnCellIndex))
            await dispatch(fightStage())
            return
          }
        }
        await dispatch(endTurn())
      }
    } else {
      if (!cell.canMove) return

      dispatch(movePlayer(cell.id))

      if (zombieOnCell) {
        dispatch(setZombieOpen(zombieOnCell.id))

        if (currentPlayer.items.find(item => item.type === 'grenade')) {
          dispatch(setCanFight('grenade'))
          return
        }

        if (
          currentPlayer.items.find(item => item.type === 'launcher') &&
          zombieOnCell.type === 'boss'
        ) {
          dispatch(setCanFight('launcher'))
          return
        }
        await dispatch(fightStage())
        return
      }

      if (itemsOnCell.length > 0) {
        for (const item of itemsOnCell) {
          if (item.type === 'key' && cell.type === 'car') {
            continue
          }
          dispatch(pickItem(item.id))
        }
      }

      if (cell.type === 'car') {
        const keyOrGasoline = currentPlayer.items.filter(
          item => item.type === 'key' || item.type === 'gasoline'
        )
        if (keyOrGasoline.length > 0) {
          keyOrGasoline.forEach(item => {
            dispatch(setItemCell({ itemId: item.id, cellId: cell.id }))
            dispatch(useItem(item.id))
          })
        }
      }

      await dispatch(endTurn())
    }
  }

  return (
    <Grid>
      {board?.cells.map((row, index) => (
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
  padding: 174px 0 200px 167px;
`
