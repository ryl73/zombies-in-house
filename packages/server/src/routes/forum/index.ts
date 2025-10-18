import { Router } from 'express'
import { router as topicRouter } from './topicRouter'
import { router as commentRouter } from './commentRouter'
import { router as replyRouter } from './replyRouter'
import { router as reactionRouter } from './reactionRouter'
import { authMiddleware } from '../../middleware/AuthMiddleware'

export const router = Router()

router.use('/topics', authMiddleware, topicRouter)
router.use('/comments', authMiddleware, commentRouter)
router.use('/reactions', authMiddleware, reactionRouter)
router.use('/replies', authMiddleware, replyRouter)
