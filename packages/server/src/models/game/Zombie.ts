import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript'
import Room from './Room'
import Cell from './Cell'

export type ZombieType = 'ordinary' | 'dog' | 'spider' | 'boss'

@Table({
  tableName: 'Zombies',
  timestamps: false, // enable if you have createdAt / updatedAt
})
export default class Zombie extends Model {
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

  @ForeignKey(() => Cell)
  @Column(DataType.UUID)
  cellId!: string | null

  @Column(DataType.STRING)
  name!: string

  @Column(DataType.ENUM('ordinary', 'dog', 'spider', 'boss'))
  type!: ZombieType

  @Default(false)
  @Column(DataType.BOOLEAN)
  opened!: boolean

  @BelongsTo(() => Room)
  room!: Room

  @BelongsTo(() => Cell)
  cell!: Cell
}
