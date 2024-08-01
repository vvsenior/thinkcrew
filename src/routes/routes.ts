import express from 'express'

import addressRouter from './address.router'
import alertRouter from './alert.router'
import authRouter from './auth.router'
import contactRouter from './contact.router'
import forgotPasswordRouter from './forgotPassword.router'
import inviteRouter from './invite.router'
import joinRouter from './join.router'
import registerRouter from './register.router'
import permissionRouter from './permission.router'
import personRouter from './person.router'
import projectRouter from './project.router'
import rootRouter from './root.router'
import scheduleRouter from './schedule.router'
import scriptRouter from './script.router'
import testRouter from './test.router'
import userRouter from './user.router'
import * as middleware from '../middleware'
import { rolesList } from '../config/rolesList'

const router = express.Router()
const apiRouter = express.Router()

// prefix all routes with /api/v2
apiRouter.use('/api/v2', router)

// Public routes
router.use('/', rootRouter)
router.use('/join', joinRouter)
router.use('/invite', inviteRouter)
router.use('/register', registerRouter)
router.use('/forgotpassword', forgotPasswordRouter)
router.use('/auth', authRouter)

// Protected routes
router.use(middleware.verifyJWT) // all routes below this will require a valid JWT
router.use('/user', userRouter) // includes invite creation route
router.use('/alert', alertRouter)
router.use('/person', personRouter)
router.use('/contact', contactRouter)
router.use('/address', addressRouter)
router.use('/permission', permissionRouter)
router.use('/project', projectRouter)
router.use('/script', scriptRouter)
router.use('/schedule', scheduleRouter)

// Admin routes
router.use(middleware.verifyRoles(rolesList.admin)) // all routes below this will require admin role
router.use('/test', testRouter)

export { apiRouter as default }