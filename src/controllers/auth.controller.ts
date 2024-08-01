import { NextFunction, Request, Response } from 'express'

import * as authService from '../services/auth.service'
import * as rootService from '../services/root.service'
import { tokenCreateAccess } from '../common/tokenCreateAccess'
import { tokenCreateRefresh } from '../common/tokenCreateRefresh'
import { cookieOptions } from '../config/cookieOptions'

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cookies = req.cookies
  const { email, password }: { email: string; password: string } = req.body
  try {  
    // validate
    rootService.validateEmail(email)
    rootService.validatePassword(password)
    // get user
    const { user, roles } = await authService.authGetUserLogin(email)
    // compare passwords
    await authService.authComparePasswords(password, user.password)
    // authenticate
    const { accessToken, refreshToken } = await authService.authCreateTokens(user, roles)
    // if there's an old token, remove it
    const wasOldToken = await authService.authRemoveOldTokens(user, cookies.jwt)
    if(wasOldToken) res.clearCookie('jwt')
    // update user token
    await user.addToken(refreshToken)
    res
      .header('x-auth', accessToken)
      .cookie('jwt', refreshToken, cookieOptions)
      .sendStatus(201)
  } catch(e) {
    next(e)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cookies = req.cookies
  try {
    // get refresh token from cookies
    const refreshToken = authService.authGetRefreshTokenFromCookies(cookies)
    res.clearCookie('jwt')
    // get user
    const { user, roles } = await authService.authGetUserByToken(refreshToken)
    // verify refresh token
    await authService.authVerify(refreshToken, user)
    // Refresh token was still valid
    const accessToken = tokenCreateAccess(user._id.toString(), roles)
    const newRefreshToken = tokenCreateRefresh(user._id.toString(), roles)
    // update tokens
    await user.removeToken(refreshToken)
    await user.addToken(newRefreshToken)
    res
      .cookie('jwt', newRefreshToken, cookieOptions)
      .status(200)
      .json({ accessToken })
  } catch(e) {
    next(e)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const cookies = req.cookies
  try {
    // get refresh token from cookies
    const refreshToken = authService.authGetRefreshTokenFromCookies(cookies)
    // get user
    const { user } = await authService.authGetUserByToken(refreshToken)
    // remove user token
    if(user) await user.removeToken(refreshToken)
    res
      .clearCookie('jwt')
      .sendStatus(204)
  } catch(e) {
    next(e)
  }
}
