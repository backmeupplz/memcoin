// Dependencies
import { prop, Typegoose, InstanceType } from 'typegoose'
import * as hash from 'object-hash'

// Winner class definition
export class UserSchema extends Typegoose {
  @prop({ required: true, index: true })
  chatId: number
  @prop({ required: true, default: 0 })
  balance: number
  @prop({ default: false })
  tokenApi: String
}

export type User = InstanceType<UserSchema>

// Get User model
const UserModel = new UserSchema().getModelForClass(UserSchema)

export async function getUser(chatId: number) {
  let user = await UserModel.findOne({ chatId })
  if (!user) {
    user = new UserModel({ chatId })
    user = await user.save()
  }
  return user
}

export async function setTokenFor(chatId: number) {
  let user = await getUser(chatId)
  user.tokenApi = hash({ chatId, secret: process.env.SECRET })
  user = await user.save()
  return user
}

export async function resetTokenFor(chatId: number) {
  let user = await getUser(chatId)
  user.tokenApi = ''
  user = await user.save()
  return user
}

export async function getLeaderboard() {
  return UserModel.find().sort({ balance: 'desc' }).limit(10)
}