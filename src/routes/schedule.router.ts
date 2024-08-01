import express from 'express'

import * as crudController from '../controllers/crud.controller'
import { Schedule, ISchedule } from '../models/schedule.model'
import { cleanBodySchedule, permission } from '../middleware'

const valueType = 'schedule'
const router = express.Router()

router.route('/')
  .post(permission('project','edit'), cleanBodySchedule, crudController.createWithPermission<ISchedule>(Schedule, valueType))
  .get(permission('project','view'), crudController.hydrateModule<ISchedule>(Schedule))
  .patch(permission(valueType,'edit'), cleanBodySchedule, crudController.updateMany<ISchedule>(Schedule))
  .delete(permission(valueType,'creator'), crudController.destroyManyWithPermission<ISchedule>(Schedule))

router.route('/:id')
  .get(permission('project','view'), crudController.read<ISchedule>(Schedule))
  .patch(permission(valueType,'edit'), cleanBodySchedule, crudController.update<ISchedule>(Schedule))
  .delete(permission(valueType,'creator'), crudController.destroyWithPermission<ISchedule>(Schedule))

export { router as default }