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
export type CanFightType =
  | 'coldWeapon'
  | 'gunWeapon'
  | 'grenade'
  | 'launcher'
  | null

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

  @Column(DataType.ENUM('coldWeapon', 'gunWeapon', 'grenade', 'launcher'))
  canFight!: CanFightType

  @Default('idle')
  @Column(DataType.ENUM('idle', 'playing', 'won', 'lost'))
  status!: GameStatus

  @Default(false)
  @Column(DataType.BOOLEAN)
  isZombieMove!: boolean

  @Default(false)
  @Column(DataType.BOOLEAN)
  isProcessing!: boolean

  @Column(DataType.JSONB)
  barricadeSelection!: string

  @Default(false)
  @Column(DataType.BOOLEAN)
  isAwaitingBarricadeDirection!: boolean

  @Default(false)
  @Column(DataType.BOOLEAN)
  canSkipTurn!: boolean

  @HasMany(() => Player)
  players!: Player[]

  @HasMany(() => Zombie)
  zombies!: Zombie[]

  @HasMany(() => Item)
  items!: Item[]

  @HasMany(() => Cell)
  cells!: Cell[]
}
