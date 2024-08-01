import { Types } from 'mongoose'

/**
 * Creates a new ObjectId from a string or undefined
 * @param id The id to convert
 * @returns The new ObjectId
 */
export function createObjectId(id: string|undefined): Types.ObjectId {
  return new Types.ObjectId(id)
}