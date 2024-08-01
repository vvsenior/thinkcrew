import { Request, Response, NextFunction } from 'express'
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

/*
  * This middleware is used to verify user roles.
  *
  */
export const verifyRoles = (...allowedRoles: number[]) => (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!req?.roles) throw new HttpException(401, i18next.t('request_must_include_role'))
    const rolesArray = [...allowedRoles]
    const result = req.roles.map(role=>rolesArray.includes(role)).find(value=>value===true)
    if(!result) throw new HttpException(401, i18next.t('user_does_not_have_approripate_role'))
    next()
  } catch (error) {
    next(error)
  }  
}