import { NextFunction, Request, Response } from 'express'

import * as contactService from '../services/contact.service'
import { Contact, IContact } from '../models/contact.model'

export const read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {  
    const _id = req.params.id
    
    // get contact
    const contact = await contactService.read<IContact>(Contact, _id)

    res
      .status(200)
      .json(contact)
  } catch(e) {
    next(e)
  }
}