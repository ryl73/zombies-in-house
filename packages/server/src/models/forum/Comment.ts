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
import Topic from './Topic'
import Reply from './Reply'
import Reaction from './Reaction'

@Table({
  tableName: 'Comments',
})
export default class Comment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string

  @ForeignKey(() => Topic)
  @Column({
    type: DataType.UUID,
    field: 'topic_id',
    allowNull: false,
  })
  topicId!: string

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
  message!: string

  @BelongsTo(() => Topic)
  topic!: Topic

  @HasMany(() => Reply)
  replies!: Reply[]

  @HasMany(() => Reaction)
  reactions!: Reaction[]
}
