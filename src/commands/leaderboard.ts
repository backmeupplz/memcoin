// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getLeaderboard, UserInfo, getUserInfo } from '../models'

// Leaderboard command
export function setupLeaderboard(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('leaderboard', async (ctx) => {
    // Get users leaderboard
    const users = await getLeaderboard()
    // Get chat users
    const members: UserInfo[] = await Promise.all(users.map(user => getUserInfo(bot.telegram, user, ctx.chat.type === 'private' ? undefined : ctx.chat.id)))
    // Prepare leaderboard
    const list = members.map(member => `*${member.name}*: ${member.balance}`).join('\n')
    // Prepare text
    const text = `🏆 Топ Мемолиархов 🏆\n\n${list}`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}