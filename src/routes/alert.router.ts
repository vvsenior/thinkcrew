import express from 'express'

import * as crudController from '../controllers/crud.controller'
import { Alert, IAlert } from '../models/alert.model'
import { cleanBodyAlert, isUserSelf } from '../middleware'

const router = express.Router()

router.route('/')
  .post(cleanBodyAlert, isUserSelf('userFrom'), crudController.create<IAlert>(Alert))
  .get(crudController.hydrateByKeyForSelf<IAlert>(Alert, 'userId'))
  .patch(cleanBodyAlert, isUserSelf('userId'), crudController.updateMany<IAlert>(Alert))
  .delete(crudController.destroyManyByKeyForSelf<IAlert>(Alert, 'userId'))

export { router as default }