import { Router } from 'express'
import ReplyController from '../../controllers/forum/replyController'

export const router = Router()

router.post('/', ReplyController.create)
router.get('/:id', ReplyController.getById)
