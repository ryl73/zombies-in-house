import { Router } from 'express'
import RoomController from '../controllers/game/roomController'
import { authMiddleware } from '../middleware/AuthMiddleware'

export const router = Router()

router.post('/', authMiddleware, RoomController.create)
router.post('/:id', authMiddleware, RoomController.update)
router.get('/:id', authMiddleware, RoomController.get)
