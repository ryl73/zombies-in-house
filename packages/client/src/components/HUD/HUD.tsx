import styled from 'styled-components'
import { Item } from '../../game/models/Item'
import { useAppDispatch, useAppSelector } from '../../hooks/useApp'
import { manualSpinPinwheel, usePlayerItem } from '../../slices/gameSlice'
import { Card, CardImage } from '../Board/CellComponent'

export const Hud = () => {
  const dispatch = useAppDispatch()

  const { players, currentPlayerIndex, canFight, isPinwheelOpen } =
    useAppSelector(state => state.game)

  const player = players[currentPlayerIndex]

  const clickHandler = async (item: Item) => {
    await dispatch(usePlayerItem(item))
  }

  const isAnimation = (item: Item) => canFight === item.type

  return (
    <HudWrapper $isOpen={isPinwheelOpen}>
      <div>
        <CardWrapper>
          <HudCard>
            <CardImage src={player.image} alt={player.name} />
          </HudCard>
          {player.name}
        </CardWrapper>
        {Array.from({ length: player.lifeCount }, (_, i) => (
          <LifeImage src="/images/game/cards/life.png" alt="life" key={i} />
        ))}
      </div>
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
          <button onClick={() => dispatch(manualSpinPinwheel())}>
            Spin pinwheel
          </button>
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
  bottom: 20px;
  padding: 10px 32px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background-color: white;
  border-radius: 10px;
  display: ${({ $isOpen }) => ($isOpen ? 'none' : 'flex')};
`

const Items = styled.div`
  display: flex;
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
