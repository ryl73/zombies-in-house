import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  BelongsTo,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript'
import Room from './Room'
import Cell from './Cell'
import Item from './Item'

export type PlayerType = 'sasha' | 'nastya' | 'max' | 'nadya' | 'boris'

@Table({
  tableName: 'Players',
})
export default class Player extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string

  @ForeignKey(() => Room)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roomId!: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number

  @ForeignKey(() => Cell)
  @Column(DataType.UUID)
  cellId!: string | null

  @Column(DataType.STRING)
  name!: string

  @Default(3)
  @Column(DataType.INTEGER)
  lifeCount!: number

  @Column(DataType.ENUM('sasha', 'nastya', 'max', 'nadya', 'boris'))
  type!: PlayerType

  @Default(false)
  @Column(DataType.BOOLEAN)
  isZombie!: boolean

  @BelongsTo(() => Room)
  room!: Room

  @BelongsTo(() => Cell)
  cell!: Cell

  @HasMany(() => Item, 'ownerId')
  items!: Item[]
}
