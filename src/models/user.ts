// Dependencies
import { prop, Typegoose, InstanceType } from 'typegoose'
import * as hash from 'object-hash'
import { Telegram } from 'telegraf'
import { getName } from '../helpers/name'

// User class definition
class User extends Typegoose {
  @prop({ required: true, index: true })
  chatId: number
  @prop({ required: true, index: true, default: 10 })
  balance: number
  @prop()
  apiToken: string
}

// User type
export type IUser = InstanceType<User>

// User info type used internally
export interface UserInfo {
  name: string;
  balance: number;
  chatId: number;
  isUndefined: boolean;
}

// User model used internally
const UserModel = new User().getModelForClass(User)

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

export async function getUserInfo(telegram: Telegram, user: IUser, chatId?: number): Promise<UserInfo> {
  try {
    // Get Telegram member
    const member = await telegram.getChatMember(chatId || user.chatId, user.chatId)
    // Return it's info
    return {
      chatId: user.chatId,
      name: getName(member),
      balance: user.balance,
      isUndefined: false,
    }
  } catch (e) {
    // In case if it fails, return deleted user
    return {
      chatId: user.chatId,
      name: `Неопределенный гаражанин`,
      balance: user.balance,
      isUndefined: true,
    }
  }
}