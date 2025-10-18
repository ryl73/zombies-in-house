import { Router } from 'express'
import ReplyController from '../../controllers/forum/replyController'

export const router = Router()

router.post('/', ReplyController.create)
router.get('/:id', ReplyController.getById)
router.delete('/:id', ReplyController.deleteById)
router.delete('/:id', ReplyController.updateById)
