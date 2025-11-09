import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript'
import Player from './Player'
import Zombie from './Zombie'
import Item from './Item'
import Cell from './Cell'

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost'

@Table({
  tableName: 'Rooms',
})
export default class Room extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  hostId!: number

  @Default(0)
  @Column(DataType.INTEGER)
  turn!: number

  @Default(0)
  @Column(DataType.INTEGER)
  currentPlayerIndex!: number

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  canFight!: boolean

  @Default('idle')
  @Column(DataType.ENUM('idle', 'playing', 'won', 'lost'))
  status!: GameStatus

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isZombieMove!: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isAwaitingBarricadeDirection!: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  canSkipTurn!: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isWinDialogOpen!: boolean

  @Column({ type: DataType.STRING })
  winningPlayerId!: string

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPinwheelOpen!: boolean

  @HasMany(() => Player)
  players!: Player[]

  @HasMany(() => Zombie)
  zombies!: Zombie[]

  @HasMany(() => Item)
  items!: Item[]

  @HasMany(() => Cell)
  cells!: Cell[]
}
