import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript'

export type ThemeType = 'light' | 'dark' | 'halloween'

@Table({ tableName: 'Themes', timestamps: false })
export default class Theme extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  override id!: string

  @Column({
    type: DataType.ENUM('light', 'dark', 'halloween'),
    allowNull: false,
    unique: true,
  })
  name!: ThemeType
}
