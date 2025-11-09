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

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isTraversable!: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isEmpty!: boolean

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  hasBarricade!: boolean

  @Column({ type: DataType.JSONB })
  availableBarricadeDirections!: string

  @Column({ type: DataType.JSONB })
  installedBarricadeDirections!: string

  @Column({ type: DataType.JSONB })
  walls!: string

  @Column(DataType.ENUM('car', 'plankPlace', 'start'))
  type?: CellType

  @BelongsTo(() => Room)
  room!: Room

  @HasMany(() => Player)
  players!: Player[]

  @HasMany(() => Zombie)
  zombies!: Zombie[]

  @HasMany(() => Item)
  items!: Item[]
}
