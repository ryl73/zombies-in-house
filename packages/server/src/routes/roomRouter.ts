import { Router } from 'express'
import RoomController from '../controllers/game/roomController'

export const router = Router()

router.post('/', RoomController.create)
router.post('/:id', RoomController.update)
router.get('/:id', RoomController.get)
