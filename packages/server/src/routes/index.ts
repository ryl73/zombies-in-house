import { Router } from 'express'
import { router as roomRouter } from './roomRouter'
import { router as forumRouter } from './forum'

export const router = Router()

router.use('/room', roomRouter)
router.use('/forum', forumRouter)
