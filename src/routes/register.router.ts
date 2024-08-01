import express from 'express'

import * as crudController from '../controllers/crud.controller'
import * as registerController from '../controllers/register.controller'
import { Register, IRegister } from '../models/register.model'

const router = express.Router()

// create register included as a part of create user

router.route('/:code')
  .get(registerController.read)

router.route('/:id')
  .delete(crudController.destroy<IRegister>(Register))

export { router as default }