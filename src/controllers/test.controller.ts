import { NextFunction, Request, Response } from 'express'

import * as emailService from '../services/email.service'

export const emailRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    emailService.emailRegister('Firstname', 'modemmute@hotmail.com', 'codeABC123', 'en')
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const emailWelcome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    emailService.emailWelcome('Firstname', 'modemmute@hotmail.com', 'en')
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const emailForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    emailService.emailForgotPassword('Firstname', 'modemmute@hotmail.com', 'codeABC123', 'en')
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const emailInvite = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    emailService.emailInvite('Full Name', 'modemmute@hotmail.com', 'codeABC123', 'Project Name', 'en')
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const emailNotify = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    emailService.emailNotify('Firstname', 'modemmute@hotmail.com', 'This is my message', 'en')
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const emailSubscribed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    emailService.emailSubscribed('Firstname', 'modemmute@hotmail.com', 'This is my message', 'en')
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const emailFarewell = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    emailService.emailFarewell('Firstname', 'modemmute@hotmail.com', 'en')
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}
