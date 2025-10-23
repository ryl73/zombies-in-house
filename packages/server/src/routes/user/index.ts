import { Router } from 'express'
import { router as userSettingsRouter } from './userSettingsRouter'
import { authMiddleware } from '../../middleware/AuthMiddleware'

export const router = Router()

router.use('/theme', authMiddleware, userSettingsRouter)
