import _ from 'lodash'
import { Model, QueryOptions } from 'mongoose'
import { Types } from 'mongoose'
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
import HttpException from '../common/http-exception'

// Generic CRUD service functions
const create = async <T>(model: Model<T>, obj: Partial<T>) => {
  const trans = i18next.t('obj_is_required')
  if(!obj) throw new HttpException(400, `${model.modelName} ${trans}`)
  return await model.create(obj)
}

const read = async <T>(model: Model<T>, _id: string|Types.ObjectId) => {
  const doc = await model.findById(_id)
  const trans = i18next.t('not_found')
  if(!doc) throw new HttpException(404, `${model.modelName} ${trans}`)
  return doc
}

const readMany = async <T>(model: Model<T>, ids: (string|Types.ObjectId)[]) => {
  const idsNeed = i18next.t('ids_need_to_be_an_array')
  if(!ids || !_.isArray(ids)) throw new HttpException(404, `${model.modelName} ${idsNeed}`)
  const docs = await model.find({ _id: { $in: ids } })
  const trans = i18next.t('not_found')
  if(!docs) throw new HttpException(404, `${model.modelName} ${trans}`)
  return docs
}

const readByObj = async <T>(model: Model<T>, query: QueryOptions<T>) => {
  const doc = await model.findOne(query)
  const trans = i18next.t('not_found')
  if(!doc) throw new HttpException(404, `${model.modelName} ${trans}`)
  return doc
}

const readManyByObj = async <T>(model: Model<T>, query: QueryOptions<T>) => {
  return await model.find(query)
}

const update = async <T>(model: Model<T>, _id: string|Types.ObjectId, obj: Partial<T>, upsert: boolean = false) => {
  const trans = i18next.t('not_found')
  const doc = await model.findOneAndUpdate({ _id }, obj, { new: true, upsert })
  if(!doc) throw new HttpException(404, `${model.modelName} ${trans}`)
  return doc
}

const updateMany = async <T>(model: Model<T>, ids: (string|Types.ObjectId)[], obj: Partial<T>) => {
  const idsNeed = i18next.t('ids_need_to_be_an_array')
  if(!ids || !_.isArray(ids)) throw new HttpException(404, `${model.modelName} ${idsNeed}`)
  const docs = await model.updateMany({ _id: { $in: ids } }, obj, { new: true })
  const trans = i18next.t('not_found')
  if(!docs) throw new HttpException(404, `${model.modelName} ${trans}`)
  return docs
}

const updateByObj = async <T>(model: Model<T>, query: QueryOptions<T>, obj: Partial<T>, upsert: boolean = false) => {
  const doc = await model.findOneAndUpdate(query, obj, { new: true, upsert })
  const trans = i18next.t('not_found')
  if(!doc) throw new HttpException(404, `${model.modelName} ${trans}`)
  return doc
}

const destroy = async <T>(model: Model<T>, _id: string|Types.ObjectId) => {
  return await model.findOneAndRemove({ _id })
}

const destroyMany = async <T>(model: Model<T>, ids: (string|Types.ObjectId)[]) => {
  const trans = i18next.t('ids_need_to_be_an_array')
  if(!ids || !_.isArray(ids)) throw new HttpException(404, `${model.modelName} ${trans}`)
  return await model.deleteMany({ _id: { $in: ids } })
}

const destroyByObj = async <T>(model: Model<T>, query: QueryOptions<T>) => {
  return await model.findOneAndRemove(query)
}

const destroyManyByObj = async <T>(model: Model<T>, query: QueryOptions<T>) => {
  return await model.deleteMany(query)
}

export { create, read, readMany, readByObj, readManyByObj, update, updateMany, updateByObj, destroy, destroyMany, destroyByObj, destroyManyByObj }
