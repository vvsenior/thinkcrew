import { model, Model, Schema, Types } from 'mongoose'

import { isValidEmail } from '../common/isValidEmail'
import { schemaOptions } from '../config/schemaOptions'

export interface IInviteProject {
  _id: Types.ObjectId;
  userFromId: Types.ObjectId;
  projectId: Types.ObjectId;
  inviteId: Types.ObjectId;
}
interface IInviteProjectMethods {} // define methods here
interface IInviteProjectModel extends Model<IInviteProject, {}, IInviteProjectMethods> {} // define static methods here

const schema = new Schema<IInviteProject, IInviteProjectModel, IInviteProjectMethods>({
  userFromId: {
    type: Schema.Types.ObjectId,
    required: [true, 'User ID for issuer of invite is required'],
    ref: 'User'
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  inviteId: {
    type: Schema.Types.ObjectId,
    ref: 'Invite'
  },
}, schemaOptions)

export const inviteProjectKeys = Object.keys(schema.paths) // array of keys of schema

export const InviteProject = model<IInviteProject, IInviteProjectModel>('InviteProject', schema)