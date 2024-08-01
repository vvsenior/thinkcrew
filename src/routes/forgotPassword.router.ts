import express from 'express'

import * as authController from '../controllers/auth.controller'
import * as crudController from '../controllers/crud.controller'
import * as forgotPasswordController from '../controllers/forgotPassword.controller'
import { Register, IRegister } from '../models/register.model'

const router = express.Router()

// forgotPassword uses the register model

router.route('/:email')
  .post(forgotPasswordController.create)

router.route('/:code')
  .get(forgotPasswordController.read, authController.login)

router.route('/:id')
  .delete(crudController.destroy<IRegister>(Register))

export { router as default }