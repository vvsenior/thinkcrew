import express, { Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { engine } from 'express-handlebars'
import 'dotenv/config'
import i18next from "i18next"
import Backend from "i18next-node-fs-backend"
import { corsOptions } from './config/corsOptions.js'
import * as middleware from './middleware'
import routes from './routes/routes'
import logger from './common/logger.js'

/* 
-------------------------------------
THINK CREW API 2
All code property of Think Crew, LLC
-------------------------------------
*/

const PORT = process.env.PORT || 3000
const ENV = process.env.NODE_ENV || 'production'

const app: Express = express()
app.use(helmet())
app.use(middleware.filter)
app.use(middleware.credentials)
app.use(cors(corsOptions))
app.use(express.json({ limit: '20mb' })) // resets size limit on incoming https data
app.use(cookieParser())

// Handlebars
app.engine('.hbs', engine({ extname: '.hbs', defaultLayout: false }))
app.set('view engine', '.hbs')
app.set('views', './src/email')

// Initialize DB
require('./db/mongoose')

// Environment Config
if(process.env.NODE_ENV === 'production') {
	app.set('trust proxy', 1) // trust first proxy
} else {
	// for tracing unhandled promises during development
	process.on('unhandledRejection', (reason, promise) => {
		logger.error(`Unhandled Promise Rejection: Promise ${promise}, Reason ${reason}, Stack: ${reason}`)
	})
}

i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      // The path should point to the root directory of your translations
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })

// Routes
app.use(routes)

// Middleware
app.use(middleware.httpLogger)
app.use(middleware.notFoundHandler)
app.use(middleware.errorHandler)

const server = app.listen(PORT, ()=>{
	logger.info(`Think Crew API 2 running on port ${PORT} in ${ENV} environment`)
})

export { app as default, server }