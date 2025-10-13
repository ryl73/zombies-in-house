import { Item } from '../../game/models/Item'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import {
  manualSpinPinwheel,
  usePlayerItem,
  skipTurn,
} from '../../slices/gameSlice'
import { Box, Button, makeStyles } from '@material-ui/core'
import { CellCard } from '../../styles/styledComponents/CellCard'
import hud from '../../assets/hud.png'
import hudHalloween from '../../assets/hud-halloween.png'

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
    background: `url(${hudHalloween}) center 50% no-repeat`,
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    display: props.isOpen ? 'none' : 'flex',
  }),
  playerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    minWidth: '150px',
  },
  playerCard: {
    width: '70px',
    height: '70px',
  },
  playerName: {
    color: 'var(--text-white)',
  },
  items: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
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
    border: 'none',
    padding: '16px 12px',
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
      <Box className={classes.playerWrapper}>
        <CellCard className={classes.playerCard}>
          <img
            className={classes.cardImage}
            src={player.image}
            alt={player.name}
          />
        </CellCard>
        <span className={classes.playerName}>{player.name}</span>
        {player.lifeCount > 0 && (
          <Box>
            {Array.from({ length: player.lifeCount }, (_, i) => (
              <img
                className={classes.lifeImage}
                src="/images/game/cards/life.png"
                alt="life"
                key={i}
              />
            ))}
          </Box>
        )}
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
          <CellCard
            $animation={isAnimation(item)}
            key={item.id}
            onClick={() => clickHandler(item)}>
            <img
              className={classes.cardImage}
              src={item.image}
              alt={item.name}
            />
          </CellCard>
        ))}
        {canFight === 'grenade' && (
          <Button
            variant="contained"
            color="primary"
            className={classes.spinButton}
            onClick={() => dispatch(manualSpinPinwheel())}>
            Spin pinwheel
          </Button>
        )}
      </Box>
    </Box>
  )
}
