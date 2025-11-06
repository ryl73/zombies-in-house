import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import Player from './Player'
import Zombie from './Zombie'
import Item from './Item'
import Room from './Room'

export type CellType = 'car' | 'plankPlace' | 'start'

@Table({ tableName: 'Cells', timestamps: false })
export default class Cell extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string

  @ForeignKey(() => Room)
  @Column({ type: DataType.UUID, allowNull: false })
  roomId!: string

  @Column(DataType.INTEGER)
  x!: number

  @Column(DataType.INTEGER)
  y!: number

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isEmpty!: boolean

  @Column(DataType.ENUM('car', 'plankPlace', 'start'))
  type?: CellType

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  hasBarricade!: boolean

  @BelongsTo(() => Room)
  room!: Room

  @HasMany(() => Player)
  players!: Player[]

  @HasMany(() => Zombie)
  zombies!: Zombie[]

  @HasMany(() => Item)
  items!: Item[]
}
