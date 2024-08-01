import { IUser } from '../models/user.model'

// to make the file a module and avoid the TypeScript error
export {}

/* eslint-disable no-unused-vars */
declare global {
  namespace Express {
    export interface Request {
      userId?: string;
      roles?: number[];
    }
  }
}