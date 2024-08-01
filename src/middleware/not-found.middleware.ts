
import { Request, Response } from 'express'

/*
  * This middleware is used to handle 404 errors.
  * 
  * This middleware should be used after all routes.
  * 
  */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).send({ message: 'Resource not found' })
}
