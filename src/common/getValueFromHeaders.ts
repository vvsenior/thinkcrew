import { IncomingHttpHeaders } from 'http'
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
import HttpException from './http-exception'

/**
 * This function is used to get a value from the headers of a request.
 * It will throw an error if the header is missing.
 * @param headers The req.headers object
 * @param headerName The header name to get the value from
 * @returns The value of req.headers[headerName]
 */
export function getValueFromHeaders(headers: IncomingHttpHeaders, headerName: string): string {
  const header = headers[headerName] ?? headers[headerName.toLowerCase()]
  const missing = i18next.t('missing')
  const trans = i18next.t('header')
  if(!header) throw new HttpException(400, `${missing} ${headerName} ${trans}`)
  return header.toString()
}
