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

export type canFightType =
  | 'coldWeapon'
  | 'gunWeapon'
  | 'grenade'
  | 'launcher'
  | null

export default class Game {
  static playerCount = 2

  public board: Board = new Board()
  public players: Player[] = []
  public items: Item[] = []
  public zombies: Zombie[] = []
  public turn = 1
  public canFight: canFightType = null

  currentPlayerIndex = 0

  public start() {
    this._createBoard()
    this._createCharacters()
    this._createItems()
    this._createZombies()
    this.moveStage().then()
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

        const cell = this.board.getCell(randomX, randomY)
        if (!cell.empty || cell.type === 'start') {
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

        const cell = this.board.getCell(randomX, randomY)
        if (!cell.empty || cell.type === 'start') {
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

    const carCells = this.board.cells.flat().filter(cell => cell.type === 'car')
    const keyItem = this.items.find(item => (item.type = 'key'))
    const gasolineItem = this.items.find(item => (item.type = 'gasoline'))

    if (
      keyItem?.cell &&
      carCells.includes(keyItem.cell) &&
      gasolineItem?.cell &&
      carCells.includes(gasolineItem.cell)
    ) {
      return 'won'
    }

    return 'playing'
  }

  async endTurn() {
    const status = this.checkGameStatus()
    if (status === 'lost') {
      window.alert('You lost!')
      return
    }

    if (status === 'won') {
      window.alert('You win!')
      return
    }

    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length
    this.turn += 1
    const currentPlayer = this.players[this.currentPlayerIndex]

    this.resetCanMoveCells()

    store.dispatch(forceUpdate())

    if (!currentPlayer.isZombie) {
      await this.moveStage(true)
    } else {
      if (this.zombies.every(zombie => !zombie.opened)) {
        await this.endTurn()
      }
    }
  }

  findAllPaths(
    start: Cell,
    board: Board,
    moveCount: number,
    maxMoveCount: number,
    isZombieTurn = false
  ): Cell[] {
    const rows = board.cells.length
    const cols = board.cells[0].length

    const results: Cell[] = []

    function canMove(
      current: Cell,
      next: Cell,
      dir: { dx: number; dy: number }
    ): boolean {
      if (dir.dx === 1) return !current.walls.bottom && !next.walls.top
      if (dir.dx === -1) return !current.walls.top && !next.walls.bottom
      if (dir.dy === 1) return !current.walls.right && !next.walls.left
      if (dir.dy === -1) return !current.walls.left && !next.walls.right
      return false
    }

    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ]

    function dfs(current: Cell, steps: number, visited: Set<number>) {
      for (const dir of directions) {
        if (steps === moveCount || steps === maxMoveCount) {
          if (!isZombieTurn && current.players.length === 0) {
            results.push(current)
          }
          if (isZombieTurn && !current.zombie) {
            results.push(current)
          }
          if (maxMoveCount <= moveCount) {
            return
          } else {
            if (steps === maxMoveCount) {
              return
            }
          }
        }

        const nx = current.x + dir.dx
        const ny = current.y + dir.dy

        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue

        const nextCell = board.getCell(nx, ny)
        if (!nextCell) continue

        if (!canMove(current, nextCell, dir)) continue

        const key = nextCell.id
        if (visited.has(key)) continue

        const isZombie = nextCell.zombie
        const isItems = nextCell.items.length > 0
        const isPlayer = nextCell.players.length > 0

        // если на клетке предмет или зомби → стоп
        if (!isZombieTurn && (isZombie || isItems)) {
          results.push(nextCell)
          continue
        }

        if (isZombieTurn && isPlayer) {
          results.push(nextCell)
          continue
        }

        visited.add(key)
        dfs(nextCell, steps + 1, visited)
        visited.delete(key)
      }
    }

    dfs(start, 0, new Set([start.id]))

    return results
  }

  async moveStage(isTurnStart = false) {
    const currentPlayer = this.players[this.currentPlayerIndex]
    if (isTurnStart && currentPlayer.cell?.zombie) {
      await this.fightStage()
      return
    }
    const { moveCount } = await PinWheel.spin()
    let maxMoveCount = moveCount
    console.log(moveCount)
    if (!currentPlayer.cell) return

    this.board.cells.forEach(row => {
      row.forEach(cell => {
        cell.canMove = false
      })
    })

    if (currentPlayer.type === 'max') {
      maxMoveCount++
    }
    if (currentPlayer.isZombie && currentPlayer.cell.zombie) {
      if (currentPlayer.cell.zombie.type === 'ordinary') {
        maxMoveCount--
        if (maxMoveCount === 0) {
          await this.moveStage()
        }
      }
      if (currentPlayer.cell.zombie.type === 'dog') {
        maxMoveCount++
      }
    }

    const availableCells = this.findAllPaths(
      currentPlayer.cell,
      this.board,
      moveCount,
      maxMoveCount,
      currentPlayer.isZombie
    )

    availableCells.forEach(cell => {
      cell.canMove = true
    })
    store.dispatch(forceUpdate())
  }

  async fightStage(): Promise<'lost' | 'win'> {
    this.resetCanMoveCells()
    let fightStatus: 'lost' | 'win' = 'lost'
    const { action } = await PinWheel.spin()
    console.log(action)
    const currentPlayer = this.players[this.currentPlayerIndex]

    switch (action) {
      case 'run': {
        await this.moveStage()
        break
      }
      case 'bite': {
        currentPlayer.lifeCount--
        store.dispatch(forceUpdate())
        if (currentPlayer.lifeCount === 0) {
          currentPlayer.items.forEach(item => {
            currentPlayer.cell?.addItem(item)
            currentPlayer.useItem(item)
          })
          currentPlayer.cell?.removePlayer(currentPlayer)
          currentPlayer.cell = null
          currentPlayer.isZombie = true
          await this.endTurn()
        } else {
          await this.fightStage()
        }
        break
      }
      case 'closeFight': {
        const defendWeapons = currentPlayer.items.filter(
          item => item.type === 'coldWeapon'
        )

        if (defendWeapons.length === 0) {
          await this.fightStage()
        } else {
          this.canFight = 'coldWeapon'
          fightStatus = 'win'
        }
        store.dispatch(forceUpdate())
        break
      }
      case 'shoot': {
        const defendWeapons = currentPlayer.items.filter(
          item => item.type === 'gunWeapon'
        )

        if (defendWeapons.length === 0) {
          await this.fightStage()
        } else {
          this.canFight = 'gunWeapon'
          fightStatus = 'win'
        }
        store.dispatch(forceUpdate())
        break
      }
    }
    store.dispatch(forceUpdate())
    return fightStatus
  }

  resetCanMoveCells() {
    this.board.cells.forEach(row => {
      row.forEach(cell => {
        cell.canMove = false
      })
    })
  }

  async winFight(player: Player) {
    player.cell?.removeZombie()
    this.zombies.filter(zombie => zombie.id !== player.cell?.zombie?.id)
    this.canFight = null
    await this.endTurn()
  }
}
