import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript'
import Comment from './Comment'

@Table({
  tableName: 'Replies',
})
export default class Reply extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  override id!: string

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.UUID,
    field: 'comment_id',
    allowNull: false,
  })
  commentId!: string

  @ForeignKey(() => Reply)
  @Column({
    type: DataType.UUID,
    field: 'parent_reply_id',
    allowNull: true,
  })
  parentReplyId!: string

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

  @BelongsTo(() => Comment)
  comment!: Comment

  @BelongsTo(() => Reply, { foreignKey: 'parentReplyId', as: 'parentReply' })
  parentReply!: Reply

  @HasMany(() => Reply, { foreignKey: 'parentReplyId', as: 'childReplies' })
  childReplies!: Reply[]
}
