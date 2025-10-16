import { Router } from 'express'
import TopicController from '../../controllers/forum/topicController'
import CommentController from '../../controllers/forum/commentController'

export const router = Router()

router.post('/', TopicController.create)
router.get('/', TopicController.getAll)
router.get('/:id', TopicController.getById)
router.get('/:topicId/comments', CommentController.getByTopicId)
