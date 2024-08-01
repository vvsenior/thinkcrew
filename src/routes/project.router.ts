import express from 'express'

import * as crudController from '../controllers/crud.controller'
import * as projectController from '../controllers/project.controller'
import { Project, IProject } from '../models/project.model'
import { cleanBodyProject, permission } from '../middleware'

const valueType = 'project'
const router = express.Router()

router.route('/')
  .post(cleanBodyProject, crudController.createWithPermission<IProject>(Project, valueType))
  .get(projectController.projectHydrate)
  .patch(permission(valueType,'edit'), cleanBodyProject, crudController.updateMany<IProject>(Project))
  .delete(permission(valueType,'creator'), crudController.destroyManyWithPermission<IProject>(Project))

router.route('/:id')
  .get(crudController.read<IProject>(Project))
  .patch(permission(valueType,'edit'), cleanBodyProject, crudController.update<IProject>(Project))
  .delete(permission(valueType,'creator'), crudController.destroyWithPermission<IProject>(Project))

export { router as default }