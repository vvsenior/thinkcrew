import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface IAddress {
  _id: Types.ObjectId;
  personId: Types.ObjectId;
  name: string;
  note: string | null;
  addressStreet1: string | null;
  addressStreet2: string | null;
  addressCity: string | null;
  addressState: string | null;
  addressZip: string | null;
  addressCountry: string | null;
}
interface IAddressMethods {} // define methods here
interface IAddressModel extends Model<IAddress, {}, IAddressMethods> {} // define static methods here

const schema = new Schema<IAddress, IAddressModel, IAddressMethods>({
  personId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Person'
  },
  name: {
    type: String,
    default: null,
  },
  note: {
    type: String,
    default: null,
  },
  addressStreet1: {
    type: String,
    default: null,
  },
  addressStreet2: {
    type: String,
    default: null,
  },
  addressCity: {
    type: String,
    default: null,
  },
  addressState: {
    type: String,
    default: null,
  },
  addressZip: {
    type: String,
    default: null,
  },
  addressCountry: {
    type: String,
    default: null,
  },
}, schemaOptions)

export const addressKeys = Object.keys(schema.paths) // array of keys of schema

export const Address = model<IAddress, IAddressModel>('Address', schema)