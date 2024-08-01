import express from 'express'

import * as crudController from '../controllers/crud.controller'
import * as contactController from '../controllers/contact.controller'
import { Contact, IContact } from '../models/contact.model'
import { cleanBodyContact } from '../middleware'

const router = express.Router()

router.route('/')
  .post(cleanBodyContact, crudController.create<IContact>(Contact))

router.route('/:id')
  .get(contactController.read)
  .patch(cleanBodyContact, crudController.update<IContact>(Contact))
  .delete(crudController.destroy<IContact>(Contact))

export { router as default }