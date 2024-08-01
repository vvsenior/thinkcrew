
export const schemaOptions = {
  id: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc: any, ret: any) {
      delete ret.isActive
      delete ret.isRegistered
      delete ret.password
      delete ret.token
      delete ret.__v
      return ret
    }
  },
}