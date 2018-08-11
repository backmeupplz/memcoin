// Dependencies
import { prop, Typegoose } from 'typegoose'

// Winner class definition
export class User extends Typegoose {
  @prop({ required: true, index: true })
  chatId: number
  @prop({ required: true, default: 10 })
  balance: number
}

// Get User model
const UserModel = new User().getModelForClass(User)

export async function getUser(chatId: number) {
  let user = await UserModel.findOne({ chatId })
  if (!user) {
    user = new UserModel({ chatId })
    user = await user.save()
  }
  return user
}

export function getLeaderboard(chatId: number) {
  return UserModel.find().sort({ balance: 'desc' }).limit(10)
}