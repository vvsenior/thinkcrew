import express from 'express'

import * as crudController from '../controllers/crud.controller'
import * as addressController from '../controllers/address.controller'
import { Address, IAddress } from '../models/address.model'
import { cleanBodyAddress } from '../middleware'

const router = express.Router()

router.route('/')
  .post(cleanBodyAddress, crudController.create<IAddress>(Address))

router.route('/:id')
  .get(addressController.read)
  .patch(cleanBodyAddress, crudController.update<IAddress>(Address))
  .delete(crudController.destroy<IAddress>(Address))

export { router as default }