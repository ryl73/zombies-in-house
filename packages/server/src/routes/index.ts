import { Router } from 'express'
import { router as roomRouter } from './roomRouter'
import { router as forumRouter } from './forum'
import { router as userSettingsRouter } from './user/userSettingsRouter'

export const router = Router()

router.use('/room', roomRouter)
router.use('/forum', forumRouter)
router.use('/user', userSettingsRouter)
