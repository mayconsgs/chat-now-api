import Hash from '@ioc:Adonis/Core/Hash'
import { Schema } from 'mongoose'
import Database from '../connection'

export interface UserODM {
  firstName: string
  lastName?: string
  fullName: string
  email: string
  password: string
  avatar?: string
  chats: []
}

const UserSchema = new Schema<UserODM>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 8 },
    avatar: { type: String, default: null },
    chats: [{ type: String }],
  },
  {
    timestamps: true,
  }
)

UserSchema.virtual('fullName').get(function () {
  const user = this as UserODM
  return user.firstName + (user.lastName || '')
})

UserSchema.pre<UserODM>('save', async function () {
  this.password = await Hash.make(this.password)
})

export const UserModel = Database.model<UserODM>('User', UserSchema)
