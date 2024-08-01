import { model, Model, Schema, Types } from 'mongoose'
import bcrypt from 'bcrypt'

import { isValidEmail } from '../common/isValidEmail'
import { schemaOptions } from '../config/schemaOptions'

interface ILocation {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  languages: string;
  asn: string;
  org: string;
}

interface IStripe {
  customer: {
    customerId: string;
  };
  paymentMethod: {
    paymentMethodId: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
    wallet: string;
    clientSecret: string;
  };
  subscriptions: [{
    subscriptionId: string;
    planId: string;
    status: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    canceledAt: number;
    daysUntilDue: number;
    created: number;
  }];
}

export interface IRole {
  role: string;
  code: number;
}

export interface IUser {
  _id: Types.ObjectId;
  isActive?: boolean;
  isRegistered?: boolean;
  roles: IRole[];
  email: string;
  password: string;
  tokens?: string[];
  location?: ILocation;
  stripe?: IStripe;
  socketId?: string;
  socketRoom?: string;
  language?: string;
  dateFormat?: string;
  units?: string;
  showProjects?: boolean;
  showDob?: boolean;
  showContacts?: boolean;
  currentProjectId?: Types.ObjectId;
  schedDesignsOrdered?: Types.ObjectId[];
  schedStripsOrdered?: Types.ObjectId[];
  schedPalettesOrdered?: Types.ObjectId[];
  schedPaneSetsOrdered?: Types.ObjectId[];
  calEventTypesOrdered?: Types.ObjectId[];
}

export interface IUserMethods { // define methods here
  addToken(token: string|null): Promise<void>;
  removeToken(token: string|null): Promise<void>;
  updateTokens(tokens: string[]|null): Promise<void>;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {} // define static methods here

const roles = new Schema({
  role: String,
  code: Number
}, { _id: false })

const location = new Schema({
  ip: String,
  city: String,
  region: String,
  region_code: String,
  country: String,
  country_name: String,
  continent_code: String,
  in_eu: Boolean,
  postal: String,
  latitude: Number,
  longitude: Number,
  timezone: String,
  utc_offset: String,
  country_calling_code: String,
  currency: String,
  languages: String,
  asn: String,
  org: String,
}, { id: false })

const stripe = new Schema({
  customer: {
    customerId: String,
  },    
  paymentMethod: {
    paymentMethodId: String,
    brand: String,
    last4: String,
    expMonth: Number,
    expYear: Number,
    wallet: String,
    clientSecret: String,
  },
  subscriptions: [{
    charge: String,
    module: String,
    subscriptionId: String,
    subscriptionItemId: String,
    promoCode: String,
  }]
}, { id: false })

const schema = new Schema<IUser, IUserModel, IUserMethods>({
  isActive: {
    type: Boolean,
    default: false
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
  roles: [roles],
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Email address is required'],
    trim: true,
    unique: true,
    validate: [isValidEmail, 'You must include a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required and must be between 6 - 20 characters'],
    select: false // don't include in standard results unless forced
  },
  tokens: [{
    type: String
  }],
  location: location,
  stripe: stripe,
  socketId: { // store socket.io current root socket.id
    type: String,
    default: null,
  },
  socketRoom: { // store socket.io current room name when present (ie sch-5cfe7e6510c4330017ab65a6)
    type: String,
    default: null,
  },
  language: {
    type: String,
    default: 'en',
  },
  dateFormat: {
    type: String,
    default: 'mm/DD/yyyy',
  },
  units: {
    type: String,
    default: 'inch',
  },
  showProjects: {
    type: Boolean,
    default: true
  },
  showDob: {
    type: Boolean,
    default: true
  },
  showContacts: {
    type: Boolean,
    default: true
  },
  currentProjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  schedDesignsOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'SchedLayout',
    default: null
  }],
  schedStripsOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'SchedStrip',
    default: null
  }],
  schedPalettesOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'SchedPalette',
    default: null
  }],
  schedPaneSetsOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'SchedPaneSet',
    default: null
  }],
  calEventTypesOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'CalendarEventTypes',
    default: null
  }],
}, schemaOptions)

export const userKeys = Object.keys(schema.paths) // array of keys of schema

schema.pre('save', async function(next) {
  if(!this.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hash) => {
      this.password = hash
      next()
    })
  })
  next()
})

schema.method('comparePassword', async function(token: string): Promise<void> {
  this.tokens = [...this.tokens, token]
  await this.save()
})
schema.method('addToken', async function(token: string): Promise<void> {
  this.tokens = [...this.tokens, token]
  await this.save()
})
schema.method('removeToken', async function(token: string): Promise<void> {
  this.tokens = this.tokens.filter((rt: string)=>rt!==token)
  await this.save()
})
schema.method('updateTokens', async function(tokens: string[]): Promise<void> {
  this.tokens = tokens
  await this.save()
})

export const User = model<IUser, IUserModel>('User', schema)