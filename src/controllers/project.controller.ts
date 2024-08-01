import { NextFunction, Request, Response } from 'express'

import * as crudService from '../services/crud.service'
import { Permission, IPermission } from '../models/permission.model'
import { Project, IProject } from '../models/project.model'

export const projectHydrate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // get permissions for this user's projects
    const permissions = await crudService.readManyByObj<IPermission>(Permission, { userId: req.userId, valueType: 'project' })
    // get projects where _id in permission.documentId
    const projects = await crudService.readManyByObj<IProject>(Project, { _id: { $in: permissions.map(p=>p.documentId) } })
    res
      .status(200)
      .json(projects)
  } catch(e) {
    next(e)
  }
}