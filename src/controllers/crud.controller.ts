import { NextFunction, Request, Response } from 'express'
import { Model, Types } from 'mongoose'

import * as crudService from '../services/crud.service'
import { Permission, IPermission } from '../models/permission.model'
import { createObjectId } from '../common/createObjectId'
import { getValueFromHeaders } from '../common/getValueFromHeaders'

// Generic CRUD controller functions

export const create = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const document = await crudService.create<T>(model, req.body)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const createWithPermission = <T>(model: Model<T>, valueType: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const document = await crudService.create<T>(model, req.body)
    const permissionObj = new Permission({ userId: req.userId, documentId: document._id, valueType, level: 'creator' })
    await crudService.create<IPermission>(Permission, permissionObj)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const read = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const document = await crudService.read<T>(model, req.params.id)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const readMany = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.body: ['123','456']
    const document = await crudService.readMany<T>(model, req.body)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const hydrateByKeyForSelf = <T>(model: Model<T>, key: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const documents = await crudService.readManyByObj<T>(model, { [key]: req.userId! })
    res
      .status(200)
      .json(documents)
  } catch(e) {
    next(e)
  }
}

export const hydrateModule = <T extends { projectId?: Types.ObjectId }>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // find permissions where userId===req.userId
    const permissions = await crudService.readManyByObj<IPermission>(Permission, { userId: createObjectId(req.userId) })
    // find documents where projectId===req.headers.X-Project
    const projectId = getValueFromHeaders(req.headers, 'X-Project')
    const projectDocuments = await crudService.readManyByObj<T>(model, { projectId: createObjectId(projectId) } as Partial<Record<keyof T, Types.ObjectId>>)
    // filter projectDocuments by permissions
    const permissionDocumentIds = permissions.map(permission => permission.documentId.toString())
    const documents = projectDocuments.filter(document => permissionDocumentIds.includes(document._id.toString()))
    // return remaining documents
    res
      .status(200)
      .json(documents)
  } catch(e) {
    next(e)
  }
}

export const update = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const document = await crudService.update<T>(model, req.params.id, req.body)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const updateMany = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.body: [{ _id: '123', ... }, { _id: '456', ... }]
    const ids = req.body.map((obj: any) => obj._id)
    const document = await crudService.update<T>(model, ids, req.body)
    res
      .status(200)
      .json(document)
  } catch(e) {
    next(e)
  }
}

export const destroy = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await crudService.destroy<T>(model, req.params.id)
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const destroyByKeyForSelf = <T extends { _id?: Types.ObjectId }>(model: Model<T>, key: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const document = await crudService.readByObj<T>(model, { _id: req.params.id, [key]: req.userId! }) // only allow user to delete their own document
    if(document) await crudService.destroy<T>(model, document._id?.toString())
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const destroyMany = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.body: ['123','456']
    await crudService.destroy<T>(model, req.body)
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const destroyManyByKeyForSelf = <T extends { _id?: Types.ObjectId }>(model: Model<T>, key: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.body: ['123','456']
    const documents = await crudService.readManyByObj<T>(model, { _id: { $in: req.body }, [key]: req.userId! }) // only allow user to delete their own documents
    await crudService.destroyMany<T>(model, documents.map((doc: T)=>doc?._id?.toString()) as string[])
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const destroyWithPermission = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await crudService.destroy<T>(model, req.params.id)
    await crudService.destroyByObj<IPermission>(Permission, { documentId: createObjectId(req.params.id) })
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}

export const destroyManyWithPermission = <T>(model: Model<T>) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // req.body: ['123','456']
    await crudService.destroyMany<T>(model, req.body)
    await crudService.destroyManyByObj<IPermission>(Permission, { documentId: { $in: req.body } })
    res
      .sendStatus(200)
  } catch(e) {
    next(e)
  }
}