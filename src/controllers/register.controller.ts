import { NextFunction, Request, Response } from 'express'

import * as crudService from '../services/crud.service'
import * as emailService from '../services/email.service'
import { Register, IRegister } from '../models/register.model'
import { User, IUser } from '../models/user.model'
import { Person, IPerson } from '../models/person.model'

export const read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get register by code
    const register = await crudService.readByObj<IRegister>(Register, { code: req.params.code })
    // update user
    const user = await crudService.update<IUser>(User, register.userId.toString(), { isActive: true, isRegistered: true })
    const person = await crudService.readByObj<IPerson>(Person, { userId: user._id })
    // send email
    const locale = user.language || "en"
    emailService.emailWelcome(person.firstname!, user.email, locale)
    res
      .status(200)
      .json(register)
  } catch(e) {
    next(e)
  }
}
