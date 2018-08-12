// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { User } from '../models/user'
import { getLeaderboard } from '../models'
import { getName } from '../helpers/name'

interface LeaderboardUser {
  name: String,
  balance: Number,
}

async function getUser(ctx: ContextMessageUpdate, user: User) {
  const member = await ctx.telegram.getChatMember(user.chatId, user.chatId)
  return {
    name: getName(member),
    balance: user.balance,
  } as LeaderboardUser
}

// Help commands
export function setupLeaderboard(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('leaderboard', async (ctx) => {
    // Get users leaderboard
    const users = await getLeaderboard()
    // Get chat users
    const members: LeaderboardUser[] = await Promise.all(users.map(user => getUser(ctx, user)))
    // Prepare leaderboard
    const list = members.map(member => `*${member.name}*: *${member.balance}*`).join('\n')
    // Prepare text
    const text = `🏆 Топ Мемолиархов 🏆\n\n${list}`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}