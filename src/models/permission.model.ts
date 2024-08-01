import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface IPermission {
  _id: Types.ObjectId;
  userId?: Types.ObjectId | null;
  documentId: Types.ObjectId;
  valueType: string;
  level: string;
}
interface IPermissionMethods {} // define methods here
interface IPermissionModel extends Model<IPermission, {}, IPermissionMethods> {} // define static methods here

const schema = new Schema<IPermission, IPermissionModel, IPermissionMethods>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  valueType: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    default: null,
    required: true,
  }
}, schemaOptions)

export const permissionKeys = Object.keys(schema.paths) // array of keys of schema

export const Permission = model<IPermission, IPermissionModel>('Permission', schema)