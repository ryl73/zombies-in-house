import { sequelize } from '../db'
import { playerModel } from './Player'
import { zombieModel } from './Zombie'
import { cellModel } from './Cell'
import { roomModel } from './Room'
import { itemModel } from './Item'

export const Player = sequelize.define('Player', playerModel, {})
export const Item = sequelize.define('Item', itemModel, {})
export const Zombie = sequelize.define('Zombie', zombieModel, {})
export const Cell = sequelize.define('Cell', cellModel, {})
export const Room = sequelize.define('Room', roomModel, {})

Room.hasMany(Player, { foreignKey: 'roomId' })
Room.hasMany(Zombie, { foreignKey: 'roomId' })
Room.hasMany(Item, { foreignKey: 'roomId' })
Room.hasMany(Cell, { foreignKey: 'roomId' })

Player.belongsTo(Cell, { foreignKey: 'cellId' })
Zombie.belongsTo(Cell, { foreignKey: 'cellId' })
Item.belongsTo(Cell, { foreignKey: 'cellId' })

Player.belongsTo(Room, { foreignKey: 'roomId' })
Zombie.belongsTo(Room, { foreignKey: 'roomId' })
Item.belongsTo(Room, { foreignKey: 'roomId' })
Cell.belongsTo(Room, { foreignKey: 'roomId' })

Item.belongsTo(Player, { foreignKey: 'ownerId' })
Player.hasMany(Item, { foreignKey: 'ownerId' })
