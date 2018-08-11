// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { User } from '../models/user'
import { getLeaderboard } from '../models'
import { getName } from '../helpers/name'

interface LeaderBoardUser {
  string: String,
  number: Number,
}

async function getUser(ctx: any, user: User): Promise<LeaderBoardUser> {
  const member = await ctx.telegram.getChatMember(user.chatId, user.chatId)
  return {
    string: getName(member),
    number: user.balance,
  }
}

// Help commands
export function setupLeaderBoard(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('leaderboard', async (ctx) => {
    // Get users leaderboard
    const users = await getLeaderboard()
    // Get chat users
    const members = await Promise.all(users.map((user: User) => getUser(ctx, user)))

    // Prepare leaderboard
    const list = members.map((member: LeaderBoardUser) => `*${member.string}*: *${member.number}*`).join('\n')
    // Prepare text
    const text = `🏆  Топ Мемолиархов 🏆\n\n${list}`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}