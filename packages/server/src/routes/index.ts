import { Router } from 'express'
import { router as roomRouter } from './roomRouter'

export const router = Router()

router.use('/room', roomRouter)
