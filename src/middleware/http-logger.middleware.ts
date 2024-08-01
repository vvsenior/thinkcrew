import morgan from 'morgan'

import logger from '../common/logger.js'

/*
  * This middleware is used to log HTTP requests.
  * 
  * This middleware should be used before all routes.
  * 
  */
export const httpLogger = morgan('tiny',
  {
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  }
)
