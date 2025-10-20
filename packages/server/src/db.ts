import { Sequelize, type SequelizeOptions } from 'sequelize-typescript'
import Room from './models/game/Room'
import Cell from './models/game/Cell'
import Item from './models/game/Item'
import Player from './models/game/Player'
import Zombie from './models/game/Zombie'
import Topic from './models/forum/Topic'
import Comment from './models/forum/Comment'
import Reply from './models/forum/Reply'
import Reaction from './models/forum/Reaction'
import Theme from './models/theme/Theme'
import UserSettings from './models/user/UserSettings'
import { seedThemes } from './seeders/seedThemes'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT,
  DB_HOST,
} = process.env

const sequelizeOptions: SequelizeOptions = {
  host: DB_HOST || 'localhost',
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  dialect: 'postgres',
  models: [
    Room,
    Cell,
    Item,
    Player,
    Zombie,
    Topic,
    Comment,
    Reply,
    Reaction,
    Theme,
    UserSettings,
  ],
}

export const sequelize = new Sequelize(sequelizeOptions)

export const dbConnect = async (): Promise<void> => {
  try {
    await sequelize.authenticate() // Проверка аутентификации в БД
    await sequelize.sync({ force: true }) // Синхронизация базы данных
    await seedThemes()
    console.log('  ➜ 🎸 Connected to the database')
  } catch (e) {
    console.error('Unable to connect to the database:', e)
  }
}
