import express from 'express'

import * as testController from '../controllers/test.controller'

const router = express.Router()

router.route('/email/register')
  .post(testController.emailRegister)

router.route('/email/welcome')
  .post(testController.emailWelcome)

router.route('/email/forgotpassword')
  .post(testController.emailForgotPassword)

router.route('/email/invite')
  .post(testController.emailInvite)

router.route('/email/notify')
  .post(testController.emailNotify)

router.route('/email/subscribed')
  .post(testController.emailSubscribed)

router.route('/email/farewell')
  .post(testController.emailFarewell)

export { router as default }