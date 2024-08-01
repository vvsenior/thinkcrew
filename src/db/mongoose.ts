import mongoose from 'mongoose'

import logger from '../common/logger.js'

mongoose.Promise = global.Promise

if(!process.env.ORMONGO_CONNECT) {
  logger.error('MongoDB connection string not found.')
  process.exit(1)
}

mongoose 
  .connect(process.env.ORMONGO_CONNECT)   
  .then(() => {
    logger.info(`MongoDB connected`)
  })
  .catch((err) => {
    logger.error('Mongo Connection Error', err)
  })

