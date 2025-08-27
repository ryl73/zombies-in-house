import { Helmet } from 'react-helmet'
import { PageInitArgs } from '../routes'
import { BoardComponent } from '../components/Board/BoardComponent'
import { useEffect, useState } from 'react'
import Game from '../game/engine/Game'
import { Hud } from '../components/HUD/HUD'
import { useAppSelector } from '../hooks/useApp'
import styled from 'styled-components'

export const GamePage = () => {
  const [game, setGame] = useState(new Game())
  const version = useAppSelector(state => state.game.version)

  useEffect(() => {
    restart()
  }, [])

  function restart() {
    const newGame = new Game()
    newGame.start()
    setGame(newGame)
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Игра</title>
        <meta name="description" content="Страница игры" />
      </Helmet>
      <main>
        <Wrapper>
          <BoardImage src="/images/board.jpg" alt="board" />
          <BoardComponent game={game} />
          {game.players[game.currentPlayerIndex] && <Hud game={game} />}
        </Wrapper>
      </main>
    </>
  )
}

const BoardImage = styled.img`
  display: block;
  position: absolute;
  z-index: 0;
  width: 1557px;
  aspect-ratio: 1;
`

const Wrapper = styled.div`
  margin: 0 auto;
  max-width: 1557px;
  display: flex;
  flex-direction: column;
`

export const initGamePage = async (_args: PageInitArgs) => {
  return Promise.resolve()
}
