import express from 'express'

import * as crudController from '../controllers/crud.controller'
import { Person, IPerson } from '../models/person.model'
import { cleanBodyPerson, isUserSelf, verifyRoles} from '../middleware'
import { rolesList } from '../config/rolesList'

const router = express.Router()

router.route('/') // note person creation is handled by register.router.ts
  .get(crudController.hydrateByKeyForSelf<IPerson>(Person, 'userId'))
  .patch(cleanBodyPerson, isUserSelf('userId'), crudController.update<IPerson>(Person))

router.route('/:id')
  .get(crudController.read<IPerson>(Person))
  .delete(verifyRoles(rolesList.admin), crudController.destroy<IPerson>(Person))

export { router as default }