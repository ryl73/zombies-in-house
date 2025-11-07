import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript'
import type { ThemeType } from '../theme/Theme'

@Table({ tableName: 'UserSettings', timestamps: false })
export default class UserSettings extends Model {
  @PrimaryKey
  @Column(DataType.INTEGER)
  userId!: number

  @Column({
    type: DataType.ENUM('light', 'dark', 'halloween'),
    allowNull: false,
    // defaultValue: 'dark',
    defaultValue: 'halloween',
  })
  theme!: ThemeType
}
