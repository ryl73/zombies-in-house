import { Router } from 'express'
import ReactionController from '../../controllers/forum/reactionController'

export const router = Router()

router.post('/', ReactionController.create)
router.get('/:id', ReactionController.getById)
router.delete('/:id', ReactionController.deleteById)
