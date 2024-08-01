import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'
import { createUUID } from '../common/createUUID'

export interface IRegister {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  code: string;
}
interface IRegisterMethods {} // define methods here
interface IRegisterModel extends Model<IRegister, {}, IRegisterMethods> {} // define static methods here

const schema = new Schema<IRegister, IRegisterModel, IRegisterMethods>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  code: {
    type: String,
    default: createUUID()
  },
}, schemaOptions)

export const registerKeys = Object.keys(schema.paths) // array of keys of schema

export const Register = model<IRegister, IRegisterModel>('Register', schema)