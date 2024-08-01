import express from 'express'

import * as rootController from '../controllers/root.controller'

const router = express.Router()

router.route('/')
  .get(rootController.status)

router.route('/emailCheck/:email')
  .get(rootController.userEmailCheck)

export { router as default }