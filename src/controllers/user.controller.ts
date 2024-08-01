import { NextFunction, Request, Response } from 'express'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"
import * as authService from '../services/auth.service'
import * as crudService from '../services/crud.service'
import * as emailService from '../services/email.service'
import * as rootService from '../services/root.service'
import * as userService from '../services/user.service'
import { User, IUser } from '../models/user.model'
import { Register, IRegister } from '../models/register.model'
import HttpException from '../common/http-exception'
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
    const { user, person } = await userService.join(req.body)
    const register = await crudService.create<IRegister>(Register, { userId: user._id })
    // send email
    const locale = user.language || "en"
    emailService.emailRegister(person.firstname!, user.email, register.code, locale)
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const document = await crudService.read<IUser>(User, req.userId!)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const document = await crudService.update<IUser>(User, req.userId!, req.body)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const passwordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { passwordOld, passwordNew } = req.body
    if(!passwordOld || !passwordNew) throw new HttpException(400, i18next.t('missing_required_fields'))
    // validate
    rootService.validatePassword(passwordOld)
    rootService.validatePassword(passwordNew)
    // get user
    const user = await crudService.read<IUser>(User, req.userId!)
    // compare passwords
    await authService.authComparePasswords(passwordOld, user.password)
    // update password
    user.password = passwordNew
    await user.save()
    res
      .sendStatus(201)
  } catch(e) {
    next(e)
  }
}
