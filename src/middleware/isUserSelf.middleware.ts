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

/*
  * This middleware is used to check if the user is accessing their own data.
  * 
  * This middleware should be used after the credentials middleware.
  * 
  */
export const isUserSelf = (key: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // find user id from req object
    const userId = req.userId
    if(!userId) throw new HttpException(406, i18next.t('user_id_not_included_in_req_object'))
    // check if userId matches object.key
    if(_.isArray(req.body)) { // if is array of objects
      req.body.forEach((obj: any) => {
        if(obj[key]!==userId) throw new HttpException(403, i18next.t(`user_does_not_have_permission_to_access_this_resource`))
      })
    } else { // else is single object
      if(req.body[key]!==userId) throw new HttpException(403, i18next.t(`user_does_not_have_permission_to_access_this_resource`))
    }
    next()
  } catch (error) {
    next(error)
  }
}