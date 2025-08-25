import { Board } from '../models/Board'
import { Player, PlayerProps } from '../models/Player'
import { getRandomInt, randomGenerator } from '../../utils/random'
import PinWheel from '../models/PinWheel'
import { Cell } from '../models/Cell'
import Zombie, { ZombieType } from '../models/Zombie'
import { store } from '../../store'
import { forceUpdate } from '../../slices/gameSlice'
import { Item, ItemType } from '../models/Item'

const CharacterMap: Record<number, Omit<PlayerProps, 'cell'>> = {
  1: { lifeCount: 3, name: 'Саша', image: '', type: 'sasha' },
  2: { lifeCount: 5, name: 'Борис', image: '', type: 'boris' },
  3: { lifeCount: 3, name: 'Макс', image: '', type: 'max' },
  4: { lifeCount: 3, name: 'Надя', image: '', type: 'nadya' },
  5: { lifeCount: 3, name: 'Настя', image: '', type: 'nastya' },
}

const ItemsMap: Record<string, { count: number; type: ItemType }> = {
  grenade: { count: 4, type: 'grenade' },
  knife: { count: 1, type: 'coldWeapon' },
  crossbow: { count: 1, type: 'coldWeapon' },
  axe: { count: 1, type: 'coldWeapon' },
  handgun: { count: 1, type: 'gunWeapon' },
  machineGun: { count: 1, type: 'gunWeapon' },
  shotgun: { count: 1, type: 'gunWeapon' },
  launcher: { count: 1, type: 'launcher' },
  medkit: { count: 6, type: 'medkit' },
  plank: { count: 8, type: 'plank' },
  gasoline: { count: 1, type: 'gasoline' },
  key: { count: 1, type: 'key' },
}

const ZombieMap: Record<
  ZombieType,
  { className: typeof Zombie; count: number }
> = {
  ordinary: { className: Zombie, count: 17 },
  dog: { className: Zombie, count: 5 },
  spider: { className: Zombie, count: 5 },
  boss: { className: Zombie, count: 1 },
}

export default class Game {
  static playerCount = 2

  public board: Board = new Board()
  public players: Player[] = []
  public items: Item[] = []
  public zombies: Zombie[] = []
  public turn = 1
  public canFight: 'coldWeapon' | 'gunWeapon' | null = null

  currentPlayerIndex = 0

  public start() {
    this._createBoard()
    this._createCharacters()
    this._createItems()
    this._createZombies()
    this.moveStage()
  }

  private _createBoard() {
    this.board.initialCells()
  }

  private _createCharacters() {
    const keys = Object.keys(CharacterMap).map(key => Number(key))
    const min = Math.min(...keys)
    const max = Math.max(...keys)

    const nextRandom = randomGenerator(min, max)

    for (let i = 0; i < Game.playerCount; i++) {
      const randomNumber = nextRandom()
      if (randomNumber === null) break

      const startCell = this.board.getCell(11, 0)
      const randomCharacter = new Player({
        ...CharacterMap[randomNumber],
        cell: startCell,
      })
      startCell.addPlayer(randomCharacter)
      this.players.push(randomCharacter)
    }
  }

  private _createItems() {
    Object.entries(ItemsMap).map(([name, value]) => {
      for (let i = 0; i < value.count; i++) {
        const randomX = getRandomInt(0, 11)
        const randomY = getRandomInt(0, 11)

        if (randomX === randomY && (randomX === 0 || randomX === 11)) {
          i--
          continue
        }

        const cell = this.board.getCell(randomX, randomY)
        if (!cell.empty) {
          i--
          continue
        }
        const item = new Item({
          image: '',
          name,
          cell: cell,
          type: value.type,
        })
        cell.addItem(item)
        this.items.push(item)
      }
    })
  }

  private _createZombies() {
    Object.entries(ZombieMap).map(([type, value]) => {
      for (let i = 0; i < value.count; i++) {
        const randomX = getRandomInt(0, 11)
        const randomY = getRandomInt(0, 11)

        if (randomX === randomY && (randomX === 0 || randomX === 11)) {
          i--
          continue
        }

        const cell = this.board.getCell(randomX, randomY)
        if (!cell.empty) {
          i--
          continue
        }

        const zombieClass = new value.className({
          image: '',
          name: type,
          cell: cell,
          type: type as ZombieType,
        })
        cell.addZombie(zombieClass)
        this.zombies.push(zombieClass)
      }
    })
  }

  checkGameStatus() {
    const alivePlayers = this.players.filter(p => !p.isZombie)
    if (alivePlayers.length === 0) {
      return 'lost'
    }

    // if (zombiesLeft === 0) {
    //   this.status = 'won'
    // }
    return 'playing'
  }

  endTurn() {
    const status = this.checkGameStatus()
    if (status === 'lost') {
      window.alert('You lost!')
      return
    }

    // if (status === 'win') {
    //   window.alert('You win!')
    //   return
    // }

    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length
    this.turn += 1
    const currentPlayer = this.players[this.currentPlayerIndex]

    this.board.cells.forEach(row => {
      row.forEach(cell => {
        cell.canMove = false
      })
    })

    store.dispatch(forceUpdate())

    if (!currentPlayer.isZombie) {
      this.moveStage()
    }
  }

  findAllPaths(start: Cell, board: Board, maxMoves: number): Cell[][] {
    const rows = board.cells.length
    const cols = board.cells[0].length

    const results: Cell[][] = []

    function canMove(
      current: Cell,
      next: Cell,
      dir: { dx: number; dy: number }
    ): boolean {
      if (dir.dx === 1) return !current.walls.right && !next.walls.left
      if (dir.dx === -1) return !current.walls.left && !next.walls.right
      if (dir.dy === 1) return !current.walls.bottom && !next.walls.top
      if (dir.dy === -1) return !current.walls.top && !next.walls.bottom
      return false
    }

    const directions = [
      { dx: 1, dy: 0 }, // вправо
      { dx: -1, dy: 0 }, // влево
      { dx: 0, dy: 1 }, // вниз
      { dx: 0, dy: -1 }, // вверх
    ]

    function dfs(
      current: Cell,
      path: Cell[],
      steps: number,
      visited: Set<string>
    ) {
      if (steps > maxMoves) return

      if (steps > 0) {
        results.push([...path])
      }

      for (const dir of directions) {
        const nx = current.x + dir.dx
        const ny = current.y + dir.dy

        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue

        const nextCell = board.getCell(nx, ny)
        if (!nextCell) continue

        // проверяем стены
        if (!canMove(current, nextCell, dir)) continue

        // запрещаем ходить по другим игрокам
        if (nextCell.players.length > 0) continue

        const key = nextCell.id
        if (visited.has(key)) continue

        visited.add(key)
        path.push(nextCell)

        // если там есть зомби или предмет —
        // можно встать, но дальше не идём
        const hasZombie = nextCell.zombie
        const hasItem = nextCell.items && nextCell.items.length > 0

        if (hasZombie || hasItem) {
          results.push([...path])
        } else {
          dfs(nextCell, path, steps + 1, visited)
        }

        path.pop()
        visited.delete(key)
      }
    }

    dfs(start, [start], 0, new Set([start.id]))

    return results
  }

  moveStage() {
    const currentPlayer = this.players[this.currentPlayerIndex]
    const { moveCount } = PinWheel.spin()
    console.log(moveCount)
    if (!currentPlayer.cell) return

    this.board.cells.forEach(row => {
      row.forEach(cell => {
        cell.canMove = false
      })
    })

    const availableCells = this.findAllPaths(
      currentPlayer.cell,
      this.board,
      moveCount
    )

    availableCells.forEach(row => {
      row.forEach(cell => {
        cell.canMove = true
      })
    })
    store.dispatch(forceUpdate())
  }

  fightStage() {
    const { action } = PinWheel.spin()
    console.log(action)
    const currentPlayer = this.players[this.currentPlayerIndex]

    this.board.cells.forEach(row => {
      row.forEach(cell => {
        cell.canMove = false
      })
    })

    switch (action) {
      case 'run': {
        this.moveStage()
        break
      }
      case 'bite': {
        currentPlayer.lifeCount--
        if (currentPlayer.lifeCount === 0) {
          currentPlayer.items.forEach(item => {
            currentPlayer.cell?.addItem(item)
            currentPlayer.useItem(item)
          })
          currentPlayer.cell?.removePlayer(currentPlayer)
          currentPlayer.cell = null
          currentPlayer.isZombie = true
          this.endTurn()
        } else {
          this.fightStage()
        }
        break
      }
      case 'closeFight': {
        const defendWeapons = currentPlayer.items.filter(
          item => item.type === 'coldWeapon' || item.type === 'grenade'
        )

        if (defendWeapons.length === 0) {
          this.fightStage()
        } else {
          this.canFight = 'coldWeapon'
        }
        break
      }
      case 'shoot': {
        const defendWeapons = currentPlayer.items.filter(
          item => item.type === 'gunWeapon' || item.type === 'grenade'
        )

        if (defendWeapons.length === 0) {
          this.fightStage()
        } else {
          this.canFight = 'gunWeapon'
        }
        break
      }
    }
    store.dispatch(forceUpdate())
  }

  winFight(player: Player) {
    player.cell?.removeZombie()
    this.zombies.filter(zombie => zombie.id !== player.cell?.zombie?.id)
    this.canFight = null
    this.endTurn()
  }
}
