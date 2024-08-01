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
import { IInvite, inviteKeys } from '../models/invite.model'
import { cleanBody } from '../common/cleanBody'
import { validateEmail } from '../services/root.service'

export const cleanBodyInvite = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cleanReqBody = cleanBody<IInvite>(req.body, inviteKeys, (obj)=>{
      if(obj.email) validateEmail(obj.email)
    })
    if(!cleanReqBody) throw new HttpException(400, i18next.t('invalid_request_body'))
    req.body = cleanReqBody
    next()
  } catch (error) {
    next(error)
  }
}