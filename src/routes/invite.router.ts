import express from 'express'

import * as crudController from '../controllers/crud.controller'
import * as inviteController from '../controllers/invite.controller'
import { Invite, IInvite } from '../models/invite.model'
import { cleanBodyJoin } from '../middleware'

const router = express.Router()

// note invite creation is handled by user.router.ts

router.route('/:code')
  .get(inviteController.read)

router.route('/join/:code')
  .post(cleanBodyJoin, inviteController.join)

router.route('/:id')
  .delete(crudController.destroy<IInvite>(Invite))

export { router as default }