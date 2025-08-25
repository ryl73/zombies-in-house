import { FC } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Item } from '../../game/models/Item'
import Game from '../../game/engine/Game'

type Props = {
  game: Game
}

export const Hud: FC<Props> = ({ game }) => {
  const player = game.players[game.currentPlayerIndex]

  const clickHandler = (item: Item) => {
    item.use(game, player)
  }

  return (
    <HudWrapper>
      <div>{player.name}</div>
      <div>{player.lifeCount}</div>
      <Items>
        {player.items.map(item => (
          <Card
            $animation={
              !!game.canFight &&
              (game.canFight === item.type || item.type === 'grenade')
            }
            key={item.id}
            onClick={() => clickHandler(item)}>
            {item.name}
          </Card>
        ))}
      </Items>
    </HudWrapper>
  )
}

const HudWrapper = styled.div`
  position: fixed;
  left: 20px;
  width: calc(100% - 40px);
  bottom: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  z-index: 999;
  background-color: white;
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
  width: 100px;
  height: 100px;
  border-radius: 10px;
  ${props =>
    props.$animation &&
    css`
      animation: ${ripple} 1s infinite ease-in-out;
    `}
`
