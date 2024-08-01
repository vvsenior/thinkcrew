import { CorsOptions } from 'cors'
import { allowedOrigins } from './allowedOrigins'

export const corsOptions: CorsOptions = {
  origin: (origin: string|undefined, callback: Function) => {
    if(origin && allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['POST', 'GET', 'PATCH', 'PUT', 'DELETE'],
	exposedHeaders:['X-Auth','X-Project','X-Script','X-Schedule'],
  optionsSuccessStatus: 200,
}
