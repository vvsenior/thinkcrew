import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface IPerson {
  _id: Types.ObjectId;
  userId?: Types.ObjectId | null;
  elementId?: Types.ObjectId | null;
  firstname: string | null;
  middlename?: string | null;
  lastname: string | null;
  position: string | null;
  about: string | null;
  dob: DateConstructor | null;
  _fullname: string;
}
interface IPersonMethods {} // define methods here
interface IPersonModel extends Model<IPerson, {}, IPersonMethods> {} // define static methods here

const schema = new Schema<IPerson, IPersonModel, IPersonMethods>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  elementId: {
    type: Schema.Types.ObjectId,
    ref: 'Element',
    default: null
  },
  firstname: {
    type: String,
    maxlength: [35, 'First name cannot be longer than 35 characters'],
    trim: true,
    default: null
  },
  middlename: {
    type: String,
    maxlength: [35, 'Middle name cannot be longer than 35 characters'],
    trim: true,
    default: null
  },
  lastname: {
    type: String,
    maxlength: [35, 'Last name cannot be longer than 35 characters'],
    trim: true,
    default: null
  },
  position: {
    type: String,
    maxlength: [50, 'Position cannot be longer than 50 characters'],
    trim: true,
    default: null
  },
  about: {
    type: String,
    maxlength: [250, 'About cannot be longer than 250 characters'],
    trim: true,
    default: null,
  },
  dob: {
    type: Date,
    default: null,
  },
}, schemaOptions)

export const personKeys = Object.keys(schema.paths) // array of keys of schema

schema.virtual('_fullname').get(function () {
  const middlename: string = this.middlename ? `${this.middlename} ` : ''
  return `${this.firstname} ${middlename}${this.lastname}`
})

export const Person = model<IPerson, IPersonModel>('Person', schema)