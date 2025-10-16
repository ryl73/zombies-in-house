import { Router } from 'express'
import CommentController from '../../controllers/forum/commentController'
import ReplyController from '../../controllers/forum/replyController'
import ReactionController from '../../controllers/forum/reactionController'

export const router = Router()

router.post('/', CommentController.create)
router.get('/:id', CommentController.getById)
router.get('/:commentId/replies', ReplyController.getByCommentId)
router.get('/:commentId/reactions', ReactionController.getByCommentId)
