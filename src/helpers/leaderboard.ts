// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { User } from '../models/user'
import { getName } from './name'

export interface LeaderboardUser {
  name: String,
  balance: Number,
  chatId: Number,
}

export async function getUserInfo(bot: Telegraf<ContextMessageUpdate>, user: User) {
  try {
    const member = await bot.telegram.getChatMember(user.chatId, user.chatId)
    return {
      chatId: user.chatId,
      name: getName(member),
      balance: user.balance,
    } as LeaderboardUser
  } catch(e) {
    console.log(e)
    return {
      chatId: user.chatId,
      name: 'Deleted',
      balance: user.balance,
    } as LeaderboardUser
  }
}