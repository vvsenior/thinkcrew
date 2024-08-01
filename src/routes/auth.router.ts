import express from 'express'

import * as authController from '../controllers/auth.controller'
import { loginLimiter } from '../middleware'

const router = express.Router()

router.route('/')
  .post(loginLimiter, authController.login)
  .get(authController.refreshToken)
  .delete(authController.logout)

export { router as default }