import { Router } from 'express'
import RoomController from '../controllers/roomController'

export const router = Router()

router.post('/', RoomController.create)
