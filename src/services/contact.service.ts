import { Model, Types } from 'mongoose'
import i18next from 'i18next'
import Backend from "i18next-node-fs-backend"
i18next
  .use(Backend)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  })
import { IUser } from '../models/user.model'
import HttpException from '../common/http-exception'

type PopulateContact = {
  personId: {
    _id: Types.ObjectId;
    userId: {
        _id: Types.ObjectId;
        showContacts: IUser['showContacts'];
    }
  }
}
type IContactPopulate<T> = T & PopulateContact

// get contact or address, ensuring that the user has permission to view it
export async function read<T>(model: Model<T>, _id: string) {
  const docPopulate: IContactPopulate<T>|null = await model
    .findOne({ _id })
    .populate({
      path: 'personId',
      select: 'userId',
      populate: {
        path: 'userId',
        select: 'showContacts'
      },
    })
    .lean()
  const trans = i18next.t('not_found')
  if(!docPopulate) throw new HttpException(403, `${model.modelName} ${trans}`)
  if(docPopulate?.personId?.userId?.showContacts===false) throw new HttpException(403, i18next.t('forbidden'))

  const doc = {
    ...docPopulate,
    personId: docPopulate.personId._id // repair the object
  }
  return doc
}