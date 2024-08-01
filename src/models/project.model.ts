import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface IProject {
  _id: Types.ObjectId;
  isActive: boolean;
  name: string;
  description?: string | null;
  season?: string | null;
}
interface IProjectMethods {} // define methods here
interface IProjectModel extends Model<IProject, {}, IProjectMethods> {} // define static methods here

const schema = new Schema<IProject, IProjectModel, IProjectMethods>({
  isActive: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    required: [true, 'Project name is required'],
    maxlength: [100, 'Project name cannot be longer than 100 characters'],
    trim: true
  },
  description: {
    type: String,
    default: null,
    maxlength: [250, 'Project description cannot be longer than 250 characters'],
    trim: true
  },
  season: {
    type: String,
    default: null,
    trim: true
  }
}, schemaOptions)

export const projectKeys = Object.keys(schema.paths) // array of keys of schema

export const Project = model<IProject, IProjectModel>('Project', schema)