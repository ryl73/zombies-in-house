import { FC, useState } from 'react'
import styled, { css } from 'styled-components'
import { Cell } from '../../game/models/Cell'
import { useAppSelector } from '../../hooks/useApp'
import { Box, makeStyles } from '@material-ui/core'
import { CellCard } from '../../styles/styledComponents/CellCard'
import { useThemeSwitcher } from '../../theme/ThemeContext'

type Props = {
  cell: Cell
  click: (cell: Cell) => void
}

const useStyles = makeStyles(() => ({
  cellBlock: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    transition: 'all 0.3s ease-in-out',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: 'black',
    zIndex: 3,
  },
  barricadeImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
}))

export const CellComponent: FC<Props> = ({ cell, click }) => {
  const { mode } = useThemeSwitcher()
  const classes = useStyles()
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
    <Box
      className={classes.cellBlock}
      onClick={() => click(cell)}
      onMouseOver={mouseOverHandler}
      onMouseLeave={mouseLeaveHandler}>
      <CellBlockCard $isOpen={isOpen}>
        {objectsOnCell.map(object => {
          const isPlayer = !('opened' in object)
          const isVisible = isPlayer || object.opened

          return (
            <CardWrapper $isOpen={isOpen} key={object.id}>
              <CellCard $isPlayer={isPlayer} $mode={mode}>
                {isVisible && (
                  <img
                    className={classes.cardImage}
                    src={object.image}
                    alt={object.name}
                  />
                )}
              </CellCard>
            </CardWrapper>
          )
        })}
      </CellBlockCard>
      {cell.isTraversable && <Box className={classes.dot} />}
      {cell.hasBarricade && (
        <img
          className={classes.barricadeImage}
          src="/images/game/cards/items/plank.png"
          alt="Barricade"
        />
      )}
    </Box>
  )
}

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
