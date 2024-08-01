import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"

import HttpException from '../common/http-exception'

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })

/*
  * This middleware is used to verify a JWT.
  *
  */
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    if(!process.env.ACCESS_TOKEN_SECRET) throw new Error(i18next.t('no_access_token_secret_found'))
    const authHeader = req.headers.authorization || req.headers.Authorization
    if((!_.isArray(authHeader) && !authHeader?.startsWith('Bearer ')) || _.isArray(authHeader) ) throw new HttpException(401, i18next.t('user_not_authorized'))
    const token = authHeader.split(' ')[1]
    jwt.verify(
      token, 
      process.env.ACCESS_TOKEN_SECRET, 
      (err, decoded) => {
        if(err || !decoded || typeof decoded === 'string') throw new HttpException(403, i18next.t('user_is_forbidden'))
        req.userId = decoded.userInfo._id
        req.roles = decoded.userInfo.roles
        next()
      }
    )
  } catch (error) {
    next(error)
  }
  
}