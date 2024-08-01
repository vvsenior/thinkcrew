import express from 'express'

import * as crudController from '../controllers/crud.controller'
import * as inviteController from '../controllers/invite.controller'
import * as userController from '../controllers/user.controller'
import { cleanBodyUser, cleanBodyInvite, verifyRoles } from '../middleware'
import { IUser, User } from '../models/user.model'
import { rolesList } from '../config/rolesList'

const router = express.Router()

router.route('/') // note user creation is handled by join.router.ts
  .get(userController.read)
  .patch(cleanBodyUser, userController.update)

router.route('/password') // reset password
  .post(userController.passwordReset)

router.route('/invite') // special route for invite creation, located here to be after verifyJWT.middleware
  .post(cleanBodyInvite, inviteController.create)

router.route('/:id')
  .delete(verifyRoles(rolesList.admin), crudController.destroy<IUser>(User))

export { router as default }