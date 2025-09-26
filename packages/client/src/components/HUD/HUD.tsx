import styled from 'styled-components'
import { Item } from '../../game/models/Item'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import {
  manualSpinPinwheel,
  usePlayerItem,
  skipTurn,
} from '../../slices/gameSlice'
import { Card } from '../Board/CellComponent'
import { Box, Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  hudWrapper: (props: { isOpen: boolean }) => ({
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 60px)',
    maxWidth: '1000px',
    bottom: 0,
    padding: '10px 32px',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    zIndex: 999,
    background: 'url(/src/assets/hud.webp) center 50% no-repeat',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    display: props.isOpen ? 'none' : 'flex',
  }),
  playerCardWrapper: {
    minWidth: '150px',
  },
  items: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
  },
  lifeImage: {
    width: '50px',
    height: '50px',
  },
  skipTurnButton: {
    padding: '10px 20px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',

    '&:hover': {
      backgroundColor: '#ff5252',
    },

    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
  },
  spinButton: {
    backgroundColor: 'var(--color-button-primary)',
    border: 'none',
    padding: '16px 12px',
    color: 'var(--color-primary)',
    margin: 0,
    borderRadius: '20px',
    cursor: 'pointer',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
}))

export const Hud = () => {
  const dispatch = useAppDispatch()
  const { players, currentPlayerIndex, canFight, isPinwheelOpen } =
    useAppSelector(state => state.game)
  const classes = useStyles({ isOpen: isPinwheelOpen })

  const player = players[currentPlayerIndex]

  const game = useAppSelector(state => state.game)

  const clickHandler = async (item: Item) => {
    await dispatch(usePlayerItem(item))
  }

  const isAnimation = (item: Item) => canFight === item.type

  return (
    <Box className={classes.hudWrapper}>
      <Box className={classes.playerCardWrapper}>
        <Box className={classes.cardWrapper}>
          <HudCard>
            <img
              className={classes.cardImage}
              src={player.image}
              alt={player.name}
            />
          </HudCard>
          {player.name}
        </Box>
        {Array.from({ length: player.lifeCount }, (_, i) => (
          <img
            className={classes.lifeImage}
            src="/images/game/cards/life.png"
            alt="life"
            key={i}
          />
        ))}
      </Box>
      {game.canSkipTurn && !game.isProcessing && (
        <Button
          className={classes.skipTurnButton}
          onClick={() => dispatch(skipTurn())}>
          Пропустить ход
        </Button>
      )}
      <Box className={classes.items}>
        {player.items.map(item => (
          <Card
            $animation={isAnimation(item)}
            key={item.id}
            onClick={() => clickHandler(item)}>
            <img
              className={classes.cardImage}
              src={item.image}
              alt={item.name}
            />
          </Card>
        ))}
        {canFight === 'grenade' && (
          <Button
            className={classes.spinButton}
            onClick={() => dispatch(manualSpinPinwheel())}>
            Spin pinwheel
          </Button>
        )}
      </Box>
    </Box>
  )
}

const HudCard = styled(Card)`
  width: 70px;
  height: 70px;
`
