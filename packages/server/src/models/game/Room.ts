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

  @Default('idle')
  @Column(DataType.ENUM('idle', 'playing', 'won', 'lost'))
  status!: GameStatus

  @HasMany(() => Player)
  players!: Player[]

  @HasMany(() => Zombie)
  zombies!: Zombie[]

  @HasMany(() => Item)
  items!: Item[]

  @HasMany(() => Cell)
  cells!: Cell[]
}
