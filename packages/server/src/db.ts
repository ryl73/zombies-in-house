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

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } =
  process.env

const sequelizeOptions: SequelizeOptions = {
  host: 'localhost',
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  dialect: 'postgres',
  models: [Room, Cell, Item, Player, Zombie, Topic, Comment, Reply, Reaction],
}

export const sequelize = new Sequelize(sequelizeOptions)

export const dbConnect = async (): Promise<void> => {
  try {
    await sequelize.authenticate() // Проверка аутентификации в БД
    await sequelize.sync() // Синхронизация базы данных
    console.log('  ➜ 🎸 Connected to the database')
  } catch (e) {
    console.error('Unable to connect to the database:', e)
  }
}
