import { Request, Response, NextFunction } from 'express'
import { allowedOrigins } from "../config/allowedOrigins"

/*
  * This middleware adds the Access-Control-Allow-Origin header to the response
  * if the origin is in the allowedOrigins array.
  * 
  * This is used to allow the frontend to access the API from a different domain.
  * 
  * This middleware should be used before any routes.
  * 
  */
export const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin
  if(origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', 'true')
  }
  next()
}