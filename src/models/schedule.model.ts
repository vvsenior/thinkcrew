import { model, Model, Schema, Types } from 'mongoose'

import { schemaOptions } from '../config/schemaOptions'

export interface ISchedule {
  _id: Types.ObjectId;
  isActive: boolean;
  name: string;
  description: string;
  projectId: Types.ObjectId;
  scriptIds: Types.ObjectId[];
  categoryGroupId: Types.ObjectId;
  schedScenariosOrdered: Types.ObjectId[];
  schedCalendarsOrdered: Types.ObjectId[];
  doodStart: string;
  doodWork: string;
  doodFinish: string;
  doodHold: string;
  doodDrop: string;
  doodPickup: string;
  doodDropDays: number;
}
interface IScheduleMethods {} // define methods here
interface IScheduleModel extends Model<ISchedule, {}, IScheduleMethods> {} // define static methods here

const schema = new Schema<ISchedule, IScheduleModel, IScheduleMethods>({
  isActive: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    required: [true, 'Schedule name is required'],
    maxlength: [70, 'Schedule name cannot be longer than 70 characters'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [255, 'Schedule description cannot be longer than 255 characters'],
    trim: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  scriptIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Script',
    default: null
  }],
  categoryGroupId: {
    type: Schema.Types.ObjectId,
    ref: 'CategoryGroup',
    default: null
  },
  schedScenariosOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'SchedScenario',
    default: null
  }],
  schedCalendarsOrdered: [{
    type: Schema.Types.ObjectId,
    ref: 'SchedCalendar',
    default: null
  }],
  doodStart: {
    type: String,
    maxlength: [4, 'DOOD abbreviations cannot be longer than 4 characters'],
    trim: true,
    default: 'S'
  },
  doodWork: {
    type: String,
    maxlength: [4, 'DOOD abbreviations cannot be longer than 4 characters'],
    trim: true,
    default: 'W'
  },
  doodFinish: {
    type: String,
    maxlength: [4, 'DOOD abbreviations cannot be longer than 4 characters'],
    trim: true,
    default: 'F'
  },
  doodHold: {
    type: String,
    maxlength: [4, 'DOOD abbreviations cannot be longer than 4 characters'],
    trim: true,
    default: 'H'
  },
  doodDrop: {
    type: String,
    maxlength: [4, 'DOOD abbreviations cannot be longer than 4 characters'],
    trim: true,
    default: 'D'
  },
  doodPickup: {
    type: String,
    maxlength: [4, 'DOOD abbreviations cannot be longer than 4 characters'],
    trim: true,
    default: 'P'
  },
  doodDropDays: {
    type: Number,
    default: 10,
  },
}, schemaOptions)

export const scheduleKeys = Object.keys(schema.paths) // array of keys of schema

export const Schedule = model<ISchedule, IScheduleModel>('Schedule', schema)