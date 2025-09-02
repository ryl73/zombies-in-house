import { Fragment } from 'react'
import styled from 'styled-components'
import { CellComponent } from './CellComponent'
import { Cell } from '../../game/models/Cell'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { handleCellClick } from '../../slices/gameSlice'

export const BoardComponent = () => {
  const dispatch = useAppDispatch()

  const { board } = useAppSelector(state => state.game)

  const handleClick = async (cell: Cell) => {
    await dispatch(handleCellClick(cell))
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
