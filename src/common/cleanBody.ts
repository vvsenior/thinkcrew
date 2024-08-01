import _ from 'lodash'

type AutomaticFields = {
  createdAt: string;
  updatedAt: string;
}
type BodyObject<T> = Partial<T & AutomaticFields>
type Body<T> = BodyObject<T> | BodyObject<T>[]
type Callback<T> = (obj: BodyObject<T>)=>void

/**
 * Cleans the body of a request by removing all fields except for the ones specified in the keys parameter.
 * @param body The body of the request.
 * @param keys The keys to keep in the body.
 * @param callback An optional callback function to run on the body after it has been cleaned.
 * @returns The cleaned body.
 */
export function cleanBody<T>(body: Body<T>, keys: string[], callback?: Callback<T>): Body<T>|null {
  let cleanBody: (BodyObject<T>|BodyObject<T>[])|null  = null
  if(_.isArray(body)) { // if body is an array, clean each object in the array
    cleanBody = body.map((obj: BodyObject<T>) => clean<T>(obj, keys, callback))
  } else if(_.isObject(body)) { // else if an object, clean that object
    cleanBody = clean<T>(body, keys, callback)
  }
  return cleanBody
}

function clean<T>(obj: BodyObject<T>, keys: string[], callback?: Callback<T>): BodyObject<T> {
  // use lodash to pick only the keys we want
  const cleanObj = _.pick(obj, keys)
  // run the callback function if it exists
  if(callback) callback(cleanObj)
  // delete any automatic fields
  delete cleanObj?.createdAt
  delete cleanObj?.updatedAt
  return cleanObj
}