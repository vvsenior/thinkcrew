import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"

import { User, IUser, IUserMethods } from '../models/user.model'
import HttpException from '../common/http-exception'
import { tokenCreateAccess } from '../common/tokenCreateAccess'
import { tokenCreateRefresh } from '../common/tokenCreateRefresh'

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })

export const authCreateTokens = async (user: IUser & IUserMethods, roles: number[]) => {
  // create tokens
  const accessToken = tokenCreateAccess(user._id.toString(), roles)
  const refreshToken = tokenCreateRefresh(user._id.toString(), roles)
  return { accessToken, refreshToken }
}

export const authGetUserLogin = async(email: string) => {
  const user = await User.findOne({ email, isActive: true },{ password: 1, roles: 1, tokens: 1 })
  const locale = user?.language || "en"
  const t = await i18next.changeLanguage(locale)
  if(!user) throw new HttpException(404, t('user_not_found'))
  const roles = user.roles.map(role=>role.code)
  return { user, roles }
}

export const authGetUserByToken = async(refreshToken: string) => {
  if(!process.env.REFRESH_TOKEN_SECRET) throw new Error(i18next.t('no_refresh_token_secret_found'))
  if(!refreshToken) throw new HttpException(400, i18next.t('token_is_required'))
  const user = await User.findOne({ tokens: refreshToken, isActive: true }, { roles: 1, tokens: 1 })
  const locale = user?.language || "en"
  const t = await i18next.changeLanguage(locale)
  if(!user) {
    jwt.verify( 
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if(err || !decoded || typeof decoded === 'string' || !decoded.userInfo?._id) throw new HttpException(403, t('user_forbidden'))
        // attempted refresh token reuse!
        const hackedUser = await User.findOne({ _id: decoded.userInfo._id }, { tokens: 1 })
        if(!hackedUser) throw new HttpException(404, t('user_not_found'))
        hackedUser.updateTokens([])
      }
    )
    throw new HttpException(403, t('user_forbidden'))
  }
  const roles = user.roles.map(role=>role.code)
  return { user, roles }
}

export const authGetRefreshTokenFromCookies = (cookies: any): string => {
  if(!cookies) throw new HttpException(401, i18next.t('cookie_is_required'))
  if(!cookies?.jwt) throw new HttpException(404, i18next.t('cookie_does_not_contain_a_token'))
  return cookies.jwt
}

export const authVerify = async (refreshToken: string, user: (IUser & IUserMethods)): Promise<void> => {
  if(!process.env.REFRESH_TOKEN_SECRET) throw new Error(i18next.t('no_refresh_token_secret_found'))
  if(!refreshToken) throw new HttpException(400, i18next.t('refresh_token_is_required'))
  if(!user) throw new HttpException(400, i18next.t('user_is_required'))
  const locale = user?.language || "en"
  const t = await i18next.changeLanguage(locale)
  return jwt.verify( 
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if(err) await user.removeToken(refreshToken) // expired refreshToken
      if(err || !decoded || typeof decoded === 'string' || user._id.toString()!==decoded?.userInfo?._id) throw new HttpException(403, t('user_forbidden'))
    }
  )
}

export const authComparePasswords = async (password1: string, password2: string): Promise<boolean> => {
  if(!password1 || !password2) throw new HttpException(400, i18next.t('passwords_are_required'))
  const match = await bcrypt.compare(password1, password2)
  if(!match) throw new HttpException(401, i18next.t('user_not_authorized'))
  return match
}

export const authRemoveOldTokens = async (user: (IUser & IUserMethods), jwt: any): Promise<boolean> => {
  if(jwt) {
    if(!user.tokens?.includes(jwt)) await user.updateTokens([]) // potential stolen token, reset all tokens
    await user.removeToken(jwt)
    return true
  }
  return false
}