import { NextFunction, Request, Response } from 'express'
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

const typeList: string[] = ['object', 'function', 'string']
const urlBlackList = ['$','&&','%26%26','||','+8+L','db.injection',';sleep(',';it=',';do{','}while(']
const bodyBlackList = ['$','&&','%26%26','||','+8+L','db.injection',';sleep(',';it=',';do{','}while(','{']

/*
  * This middleware is used to filter the request.
  * 
  * This middleware should be used before all routes.
  * 
  */
export const filter = (req: Request, res: Response, next: NextFunction) => {
  try {
    // examine URL
    const trans = i18next.t('a_forbidden_expression_has_been_found_in_the_data_you_entered')
    const url = req.originalUrl.toLowerCase()
    for(let i = 0; i < urlBlackList.length; i++){
      if(url.indexOf(urlBlackList[i].toLowerCase()) !== -1) {
        throw new HttpException(405, `${trans} ${urlBlackList[i]}`)
      }
    }
    // examine body
    if(req.body && Object.keys(req.body).length) {
      jsonToString(req.body, typeList, function(str: string){
        str = str.toLowerCase()
        for (var i = 0; i < bodyBlackList.length; i++){
          if (str.indexOf(bodyBlackList[i].toLowerCase()) !== -1) {
            throw new HttpException(405, `${trans} ${bodyBlackList[i]}`)
          }
        }
      })
    }
    next()
  } catch (error) {
    next(error)
  }
  
}

function jsonToString(json: any, typeList: string[], callback:(str: string)=>void) {
  const visitNode = function(obj: any) {
    const type = typeof(obj)
    if(obj === null || typeList.indexOf(type) === -1) return ''
    switch (type) {
      case 'string':
          return obj
      case 'number':
      case 'boolean':
      case 'undefined':
          return String(obj)
      default:
        return visitObject(obj)
    }
  }
  const visitObject = function(obj: any) {
    let buffer = ''
    const keys = Object.keys(obj)
    const includeKey = !Array.isArray(obj)
    for(let i = 0; i < keys.length; ++i) {
      const key = keys[i]
      buffer += (includeKey ? key : '') + visitNode(obj[key])
    }
    return buffer
  }
  return callback(visitNode(json))
}