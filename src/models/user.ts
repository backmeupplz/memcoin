// Dependencies
import { prop, Typegoose, InstanceType } from 'typegoose'
import * as hash from 'object-hash'
import { Telegram } from 'telegraf'
import { getName } from '../helpers/name'

// User class definition
class UserSchema extends Typegoose {
  @prop({ required: true, index: true })
  chatId: number
  @prop({ required: true, default: 10 })
  balance: number
  @prop()
  apiToken: String
}

// User type
export type User = InstanceType<UserSchema>

// User info type used internally
export interface UserInfo {
  name: String,
  balance: Number,
  chatId: Number,
}

// User model used internally
const UserModel = new UserSchema().getModelForClass(UserSchema)

export async function getUser(chatId: number) {
  // Find user
  let user = await UserModel.findOne({ chatId })
  // Create new one if doesn't exist
  if (!user) {
    user = new UserModel({ chatId })
    user = await user.save()
  }
  // Return user
  return user
}

export async function getUserByToken(apiToken: string) {
  // Find user by api token
  return UserModel.findOne({ apiToken })
}

export async function generateApiTokenForUser(chatId: number) {
  // Find user
  let user = await getUser(chatId)
  // Add token
  user.apiToken = hash({ chatId, secret: process.env.SECRET })
  // Save user
  user = await user.save()
  // Return user
  return user
}

export async function revokeApiTokenForUser(chatId: number) {
  // Find user
  let user = await getUser(chatId)
  // Delete token
  user.apiToken = undefined
  // Save user
  user = await user.save()
  // Return user
  return user
}

export async function getLeaderboard() {
  // Find 10 users with the most balance
  return UserModel.find().sort({ balance: 'desc' }).limit(10)
}

export async function getUserInfo(telegram: Telegram, user: User): Promise<UserInfo> {
  try {
    // Get Telegram member
    const member = await telegram.getChatMember(user.chatId, user.chatId)
    // Return it's info
    return {
      chatId: user.chatId,
      name: getName(member),
      balance: user.balance,
    }
  } catch (e) {
    // In case if it fails, return deleted user
    return {
      chatId: user.chatId,
      name: 'Deleted User',
      balance: user.balance,
    }
  }
}