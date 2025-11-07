import { Router } from 'express'
import UserSettingsController from '../../controllers/user/userSettingsController'

export const router = Router()

router.get('/', UserSettingsController.getTheme)
router.post('/', UserSettingsController.setTheme)
