// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getUserInfo, LeaderboardUser } from '../helpers/leaderboard'
import { getLeaderboard } from '../models'

// Leaderboard command
export function setupLeaderboard(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('leaderboard', async (ctx) => {
    // Get users leaderboard
    const users = await getLeaderboard()
    // Get chat users
    const members: LeaderboardUser[] = await Promise.all(users.map(user => getUserInfo(bot, user)))
    // Prepare leaderboard
    const list = members.map(member => `*${member.name}*: ${member.balance}`).join('\n')
    // Prepare text
    const text = `🏆 Топ Мемолиархов 🏆\n\n${list}`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}