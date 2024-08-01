import express from 'express'

import * as crudController from '../controllers/crud.controller'
import { Script, IScript } from '../models/script.model'
import { cleanBodyScript, permission } from '../middleware'

const valueType = 'script'
const router = express.Router()

router.route('/')
  .post(permission('project','edit'), cleanBodyScript, crudController.createWithPermission<IScript>(Script, valueType))
  .get(permission('project','view'), crudController.hydrateModule<IScript>(Script))
  .patch(permission(valueType,'edit'), cleanBodyScript, crudController.updateMany<IScript>(Script))
  .delete(permission(valueType,'creator'), crudController.destroyManyWithPermission<IScript>(Script))

router.route('/:id')
  .get(permission('project','view'), crudController.read<IScript>(Script))
  .patch(permission(valueType,'edit'), cleanBodyScript, crudController.update<IScript>(Script))
  .delete(permission(valueType,'creator'), crudController.destroyWithPermission<IScript>(Script))

export { router as default }