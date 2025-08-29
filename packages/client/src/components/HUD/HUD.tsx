import styled, { css, keyframes } from 'styled-components'
import { Item } from '../../game/models/Item'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import {
  addPlayerLifeCount,
  fightStage,
  setCanFight,
  useItem,
  winFight,
} from '../../slices/gameSlice'

export const Hud = () => {
  const dispatch = useAppDispatch()

  const { players, currentPlayerIndex, canFight, zombies } = useAppSelector(
    state => state.game
  )

  const player = players[currentPlayerIndex]

  const clickHandler = async (item: Item) => {
    const zombieOnCell = zombies.find(
      zombie => zombie.cellId === player.cellId && zombie.cellId !== null
    )

    switch (item.type) {
      case 'medkit': {
        dispatch(useItem(item.id))
        if (player.type === 'nastya') {
          dispatch(addPlayerLifeCount(2))
          break
        }
        dispatch(addPlayerLifeCount(1))
        break
      }
      case 'grenade': {
        if (zombieOnCell) {
          dispatch(useItem(item.id))
          dispatch(winFight())
        }
        break
      }
      case 'launcher': {
        if (zombieOnCell && zombieOnCell.type === 'boss') {
          dispatch(useItem(item.id))
          dispatch(winFight())
        }
        break
      }
      case 'coldWeapon': {
        if (zombieOnCell) {
          dispatch(winFight())
        }
        break
      }
      case 'gunWeapon': {
        if (zombieOnCell) {
          dispatch(winFight())
        }
        break
      }
      case 'plank': {
        // if (currentCell?.type === 'plankPlace') {
        // player.cell.addItem(this)
        // this.cell = player.cell
        // dispatch(useItem(item.id))
        // }
        break
      }
    }
  }

  const spinPinWheel = async () => {
    if (canFight === 'grenade') {
      dispatch(setCanFight(null))
      dispatch(fightStage())
    }
  }

  const isAnimation = (item: Item) => {
    if (canFight) {
      if (canFight === 'coldWeapon' && item.type === 'coldWeapon') {
        return true
      }
      if (canFight === 'gunWeapon' && item.type === 'gunWeapon') {
        return true
      }
      if (canFight === 'grenade' && item.type === 'grenade') {
        return true
      }
      if (canFight === 'launcher' && item.type === 'launcher') {
        return true
      }
    }
    return false
  }

  return (
    <HudWrapper>
      <div>{player.name}</div>
      <div>{player.lifeCount}</div>
      <Items>
        {player.items.map(item => (
          <Card
            $animation={isAnimation(item)}
            key={item.id}
            onClick={() => clickHandler(item)}>
            {item.name}
          </Card>
        ))}
        {canFight === 'grenade' && (
          <button onClick={spinPinWheel}>Spin pinwheel</button>
        )}
      </Items>
    </HudWrapper>
  )
}

const HudWrapper = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 60px);
  max-width: 1000px;
  bottom: 20px;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
  background-color: white;
  border-radius: 10px;
`

const Items = styled.div`
  display: flex;
  gap: 20px;
`

const ripple = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const Card = styled.div<{ $animation?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: gray;
  width: 50px;
  height: 50px;
  border-radius: 10px;
  ${props =>
    props.$animation &&
    css`
      animation: ${ripple} 1s infinite ease-in-out;
    `}
`
