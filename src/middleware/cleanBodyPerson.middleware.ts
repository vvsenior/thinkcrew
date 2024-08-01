import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"
i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })
import HttpException from '../common/http-exception'
import { IPerson, personKeys } from '../models/person.model'
import { cleanBody } from '../common/cleanBody'
import { validateName, validateLength } from '../services/root.service'

export const cleanBodyPerson = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cleanReqBody = cleanBody<IPerson>(req.body, personKeys, (obj)=>{
      if(obj.firstname) validateName('First name', obj.firstname)
      if(obj.middlename) validateName('Middle name', obj.middlename)
      if(obj.lastname) validateName('Last name', obj.lastname)
      if(obj.position) validateLength('Position', obj.position, 1, 50)
      if(obj.about) validateLength('About', obj.about, 1, 250)
    })
    if(!cleanReqBody) throw new HttpException(400, i18next.t('invalid_request_body'))
    req.body = cleanReqBody
    next()
  } catch (error) {
    next(error)
  }
}