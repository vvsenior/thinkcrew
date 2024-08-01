import express from 'express'

import * as userController from '../controllers/user.controller'
import { cleanBodyJoin } from '../middleware'

const router = express.Router()

router.route('/')
  .post(cleanBodyJoin, userController.create) // handles create user, person, contact and register

export { router as default }