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
import Player from './Player'

export type ItemType =
  | 'coldWeapon'
  | 'gunWeapon'
  | 'grenade'
  | 'launcher'
  | 'medkit'
  | 'plank'
  | 'key'
  | 'gasoline'

@Table({
  tableName: 'Items',
  timestamps: false,
})
export default class Item extends Model {
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

  @Column(DataType.UUID)
  ownerId!: string | null

  @Column(DataType.STRING)
  name!: string

  @Column(DataType.STRING)
  image!: string

  @Column(
    DataType.ENUM(
      'coldWeapon',
      'gunWeapon',
      'grenade',
      'launcher',
      'medkit',
      'plank',
      'key',
      'gasoline'
    )
  )
  type!: ItemType

  @Default(false)
  @Column(DataType.BOOLEAN)
  opened!: boolean

  @BelongsTo(() => Room)
  room!: Room

  @BelongsTo(() => Cell)
  cell!: Cell

  @BelongsTo(() => Player, 'ownerId')
  owner!: Player
}
