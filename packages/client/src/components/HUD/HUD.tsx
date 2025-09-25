import styled from 'styled-components'
import { Item } from '../../game/models/Item'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import {
  manualSpinPinwheel,
  usePlayerItem,
  skipTurn,
} from '../../slices/gameSlice'
import { Card, CardImage } from '../Board/CellComponent'
import { Button } from '../../styles/Buttons'
import hud from '../../assets/hud.webp'

export const Hud = () => {
  const dispatch = useAppDispatch()

  const { players, currentPlayerIndex, canFight, isPinwheelOpen } =
    useAppSelector(state => state.game)

  const player = players[currentPlayerIndex]

  const game = useAppSelector(state => state.game)

  const clickHandler = async (item: Item) => {
    await dispatch(usePlayerItem(item))
  }

  const isAnimation = (item: Item) => canFight === item.type

  return (
    <HudWrapper $isOpen={isPinwheelOpen}>
      <PlayerCardWrapper>
        <CardWrapper>
          <HudCard>
            <CardImage src={player.image} alt={player.name} />
          </HudCard>
          {player.name}
        </CardWrapper>
        {Array.from({ length: player.lifeCount }, (_, i) => (
          <LifeImage src="/images/game/cards/life.png" alt="life" key={i} />
        ))}
      </PlayerCardWrapper>
      {game.canSkipTurn && !game.isProcessing && (
        <SkipTurnButton onClick={() => dispatch(skipTurn())}>
          Пропустить ход
        </SkipTurnButton>
      )}
      <Items>
        {player.items.map(item => (
          <Card
            $animation={isAnimation(item)}
            key={item.id}
            onClick={() => clickHandler(item)}>
            <CardImage src={item.image} alt={item.name} />
          </Card>
        ))}
        {canFight === 'grenade' && (
          <SpinButton onClick={() => dispatch(manualSpinPinwheel())}>
            Spin pinwheel
          </SpinButton>
        )}
      </Items>
    </HudWrapper>
  )
}

const HudWrapper = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 60px);
  max-width: 1000px;
  bottom: 0;
  padding: 10px 32px;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  z-index: 999;
  background: url(${hud}) center 50% no-repeat;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: ${({ $isOpen }) => ($isOpen ? 'none' : 'flex')};
`

const PlayerCardWrapper = styled.div`
  min-width: 150px;
`

const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`

const HudCard = styled(Card)`
  width: 70px;
  height: 70px;
`

const LifeImage = styled.img`
  width: 50px;
  height: 50px;
`
const SkipTurnButton = styled.button`
  padding: 10px 20px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #ff5252;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

const SpinButton = styled(Button)`
  margin: 0;
  border-radius: 20px;
  cursor: pointer;
`
