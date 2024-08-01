import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface IContact {
  _id: Types.ObjectId;
  personId: Types.ObjectId;
  valueType: string;
  name: string;
  value: string | null;
  note: string | null;
}
interface IContactMethods {} // define methods here
interface IContactModel extends Model<IContact, {}, IContactMethods> {} // define static methods here

const schema = new Schema<IContact, IContactModel, IContactMethods>({
  personId: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
    default: null,
  },
  valueType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: null,
  },
  note: {
    type: String,
    default: null,
  },
}, schemaOptions)

export const contactKeys = Object.keys(schema.paths) // array of keys of schema

export const Contact = model<IContact, IContactModel>('Contact', schema)