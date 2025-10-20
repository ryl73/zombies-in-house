import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript'
import Comment from './Comment'

@Table({
  tableName: 'Topics',
})
export default class Topic extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string

  @Column({
    type: DataType.STRING,
    field: 'author_login',
    allowNull: false,
  })
  authorLogin!: string

  @Column({
    type: DataType.STRING,
    field: 'author_avatar',
  })
  authorAvatar!: string

  @Column(DataType.STRING)
  title!: string

  @Column(DataType.STRING)
  description!: string

  @HasMany(() => Comment)
  comments!: Comment[]
}
