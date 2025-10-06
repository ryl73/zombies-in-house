import { Fragment } from 'react'
import { CellComponent } from './CellComponent'
import { Cell } from '../../game/models/Cell'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { handleCellClick } from '../../slices/gameSlice'
import { Grid, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  grid: {
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    borderCollapse: 'collapse',
    gridTemplateColumns: 'repeat(12, 100px)',
    gap: '2px',
    padding: '174px 0 200px 167px',
  },
}))

export const BoardComponent = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()

  const { board } = useAppSelector(state => state.game)

  const handleClick = async (cell: Cell) => {
    await dispatch(handleCellClick(cell))
  }

  return (
    <Grid className={classes.grid}>
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
