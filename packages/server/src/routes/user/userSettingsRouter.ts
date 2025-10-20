import { Router } from 'express'
import UserSettingsController from '../../controllers/user/userSettingsController'

export const router = Router()

router.get('/theme', UserSettingsController.getTheme)
router.post('/theme', UserSettingsController.setTheme)
