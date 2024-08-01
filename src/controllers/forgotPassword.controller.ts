import { NextFunction, Request, Response } from 'express'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"
import * as authService from '../services/auth.service'
import * as crudService from '../services/crud.service'
import * as emailService from '../services/email.service'
import { Register, IRegister } from '../models/register.model'
import { User, IUser, IUserMethods } from '../models/user.model'
import { Person, IPerson } from '../models/person.model'
import HttpException from '../common/http-exception'
import { isValidEmail } from '../common/isValidEmail'
import { cookieOptions } from '../config/cookieOptions'
i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })
export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const email = req.params.email
    if(!email || !isValidEmail(email)) throw new HttpException(400, i18next.t('you_must_provide_a_valid_email_address'))
    // find user
    const user = await crudService.readByObj<IUser>(User, { email, isActive: true })
    const person = await crudService.readByObj<IPerson>(Person, { userId: user._id })
    // create register
    const register = await crudService.create<IRegister>(Register, { userId: user._id })
    // send email
    const locale = user.language || "en"
    emailService.emailForgotPassword(person.firstname!, email, register.code, locale)
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get register by code
    const register = await crudService.readByObj<IRegister>(Register, { code: req.params.code })
    // find user by id
    const user = await User.findOne({ _id: register.userId, isActive: true },{ password: 1, roles: 1, tokens: 1 })
    if(!user) throw new HttpException(400, i18next.t('user_not_found'))   
    // create tokens 
    const { accessToken, refreshToken } = await authService.authCreateTokens(user as (IUser & IUserMethods), user.roles.map(role=>role.code))
    // handle old tokens
    await user.updateTokens([])
    res.clearCookie('jwt')
    // update user token
    await user.addToken(refreshToken)
    res
      .header('x-auth', accessToken)
      .cookie('jwt', refreshToken, cookieOptions)
      .sendStatus(201)
  } catch(e) {
    next(e)
  }
}
