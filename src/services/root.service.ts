
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"
import { User } from '../models/user.model'
import { isValidEmail } from '../common/isValidEmail'
import { isValidPassword } from '../common/isValidPassword'
import { isValidName } from '../common/isValidName'
import HttpException from '../common/http-exception'
import { Types } from 'mongoose'

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })

type ServerStatus = {
  name: string|undefined,
  version: string|undefined,
  status: string,
  timestamp: string
}

export const serverStatus = async (): Promise<ServerStatus> => {
  const status = 'online' // TODO: check db connection
  return {
    name: process.env.npm_package_name,
    version: process.env.npm_package_version,
    status,
    timestamp: new Date().toISOString()
  }
}

export const doesUserEmailExist = async (email: string): Promise<boolean> => {
  if(!email) throw new HttpException(400, i18next.t('email_address_is_required'))
  const user = await User.findOne({ email: email.toLowerCase() })
  return !!user
}

export const emailDuplicateCheck = async (email: string): Promise<void> => {
  const exists = await doesUserEmailExist(email)
  if(exists) throw new HttpException(409, i18next.t('email_address_already_in_use_by_another_user'))
}

export const validateLength = (key: string, value: string, min: number = 1, max: number = 10000): void => {
  if(value.length < min || value.length > max) throw new HttpException(400, `${key} must be between ${min} - ${max} characters`)
}

export const validateName = (key: string, name: string, required: boolean = false): void => {
  if(required && !name?.length) throw new HttpException(400, `${key} is required`)
  validateLength(key, name, 1, 35)
  const valid = i18next.t('valid')
  const cannotContain = i18next.t('cannot_contain_special_characters_such_as')
  if(!isValidName(name)) throw new HttpException(400, `${valid} ${key}s ${cannotContain} \`~!@#$%^&*()-_=+|[]{}<.>?`)
}

export const validateEmail = (email: string): void => {
  if(!email) throw new HttpException(400, i18next.t('email_is_required'))
  if(!isValidEmail(email)) throw new HttpException(400, i18next.t('you_must_include_a_valid_email_address'))
}

export const validatePassword = (password: string): void => {
  if(!password) throw new HttpException(400, i18next.t('password_is_required'))
  validateLength('Password', password, 6, 20)
  const trans = i18next.t('password_can_only_contain_letters_numbers_and_the_following_special_characters')
  if(!isValidPassword(password)) throw new HttpException(400, "${trans} `~!@#$%^&*()-_=+|[]{}<.>?")
}