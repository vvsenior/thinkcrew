import { Request, Response, NextFunction } from 'express'
import _ from 'lodash'

import HttpException from '../common/http-exception'
import { Permission } from '../models/permission.model'
import { comparePermissionLevels } from '../common/comparePermissionLevels'
import { getValueFromHeaders } from '../common/getValueFromHeaders'
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
const headers: {[x:string]:string} = { // all collections that require permissions
  project: 'X-Project',
  script: 'X-Script',
  schedule: 'X-Schedule',
  schedDesign: 'X-SchedDesign',
  schedPalette: 'X-SchedPalette',
  design: 'X-Design',
}

/*
  * This middleware is used to check if the user has permission to access a document.
  * 
  * This middleware should be used after the credentials middleware.
  * 
  */
export const permission = (valueType: string, minimumLevel: string) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // find user id from req object
    const userId = req.userId
    if(!userId) throw new HttpException(406, i18next.t('user_ID_not_included_in_req_object'))

    // find document id from headers
    const headerName: string = headers[valueType] // set header name based on valueType
    const documentId = getValueFromHeaders(req.headers, headerName)

    // find permission for user
    const permissionTrans = i18next.t('you_do_not_have_permission_to_access_this')
    const permission = await Permission.findOne({ userId, documentId, valueType })
    if(!permission) throw new HttpException(401, `${permissionTrans} ${valueType}`)

    // check if user has high enough permission to access this document
    const hasPermiTrans = i18next.t('your_permission_level_is_not_high_enough_for_this')
    const hasPermissionLevel = comparePermissionLevels(permission.level, minimumLevel)
    if(!hasPermissionLevel) throw new HttpException(401, `${hasPermiTrans} ${valueType}`)

    next()
  } catch (error) {
    next(error)
  }
}