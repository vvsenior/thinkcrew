import express from 'express'

import * as crudController from '../controllers/crud.controller'
import { Permission, IPermission } from '../models/permission.model'
import { cleanBodyPermission } from '../middleware'

const router = express.Router()

router.route('/')
  .post(cleanBodyPermission, crudController.create<IPermission>(Permission))
  .get(crudController.hydrateByKeyForSelf<IPermission>(Permission, 'userId'))

router.route('/:id')
  .get(crudController.read<IPermission>(Permission))
  .patch(cleanBodyPermission, crudController.update<IPermission>(Permission))
  .delete(crudController.destroy<IPermission>(Permission))

export { router as default }