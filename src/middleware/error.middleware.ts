import { NextFunction, Request, Response } from 'express'

import logger from '../common/logger'
import HttpException from '../common/http-exception'

/*
  * This middleware is used to handle errors.
  * 
  * This middleware should be used after all routes.
  * 
  */
export const errorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || err.status || 500
  logger.error(err.message)
  res.status(status).send({ message: err.message })
}
