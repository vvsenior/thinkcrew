import rateLimit from 'express-rate-limit'
import logger from '../common/logger'

/*
  * This middleware is used to limit login attempts.
  * 
  * This middleware should be used before the login route.
  * 
  */
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 login requests per window per minute
  message: 'Too many login attempts from this IP, please try again after 1 minute',
  handler: (req, res, next, options) => {
    logger.warn(`Too many login attempts from ${req.socket.remoteAddress}`)
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false
})
