import { NextFunction, Request, Response } from 'express'

import * as contactService from '../services/contact.service'
import { Address, IAddress } from '../models/address.model'

export const read = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {  
    const _id = req.params.id
    
    // get address
    const address = await contactService.read<IAddress>(Address, _id)

    res
      .status(200)
      .json(address)
  } catch(e) {
    next(e)
  }
}