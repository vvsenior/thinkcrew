import { NextFunction, Request, Response } from 'express'

import * as rootService from '../services/root.service'

export const status = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response = await rootService.serverStatus()
    res
      .status(200)
      .send(response)
  } catch(e) {
    next(e)
  }
}

export const userEmailCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const email = req.params.email
  try {
    // validate
    rootService.validateEmail(email)
    // check if email exists
    const response = await rootService.doesUserEmailExist(email)
    res
      .status(200)
      .send(response)
  } catch(e) {
    next(e)
  }
}
