import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface IAlert {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userFrom: Types.ObjectId;
  message: string;
  isRead: boolean;
}
interface IAlertMethods {} // define methods here
interface IAlertModel extends Model<IAlert, {}, IAlertMethods> {} // define static methods here

const schema = new Schema<IAlert, IAlertModel, IAlertMethods>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  userFrom: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false,
    required: true
  },
}, schemaOptions)

export const alertKeys = Object.keys(schema.paths) // array of keys of schema

export const Alert = model<IAlert, IAlertModel>('Alert', schema)