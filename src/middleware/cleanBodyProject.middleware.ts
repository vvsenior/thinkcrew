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
import { IProject, projectKeys } from '../models/project.model'
import { cleanBody } from '../common/cleanBody'
import { validateName, validateLength } from '../services/root.service'

export const cleanBodyProject = (req: Request, res: Response, next: NextFunction) => {
  try {
    const cleanReqBody = cleanBody<IProject>(req.body, projectKeys, (obj)=>{
      if(obj.name) validateName('Project name', obj.name)
      if(obj.description) validateLength('Project description', obj.description, 1, 250)
    })
    if(!cleanReqBody) throw new HttpException(400, i18next.t('invalid_request_body'))
    req.body = cleanReqBody
    next()
  } catch (error) {
    next(error)
  }
}