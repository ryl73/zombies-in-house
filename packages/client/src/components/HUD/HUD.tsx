import { FC } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Item } from '../../game/models/Item'
import Game from '../../game/engine/Game'

type Props = {
  game: Game
}

export const Hud: FC<Props> = ({ game }) => {
  const player = game.players[game.currentPlayerIndex]

  const clickHandler = async (item: Item) => {
    await item.use(game, player)
  }

  const spinPinWheel = async () => {
    if (game.canFight === 'grenade') {
      game.canFight = null
      await game.fightStage()
    }
  }

  const isAnimation = (item: Item) => {
    if (game.canFight) {
      if (game.canFight === 'coldWeapon' && item.type === 'coldWeapon') {
        return true
      }
      if (game.canFight === 'gunWeapon' && item.type === 'gunWeapon') {
        return true
      }
      if (game.canFight === 'grenade' && item.type === 'grenade') {
        return true
      }
      if (game.canFight === 'launcher' && item.type === 'launcher') {
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
        {game.canFight === 'grenade' && (
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
