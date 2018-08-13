// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getLeaderboard, UserInfo, getUserInfo } from '../models'
import { findIndex } from 'lodash'

// Leaderboard command
export function setupLeaderboard(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('leaderboard', async (ctx) => {
    // Get users leaderboard
    const users = await getLeaderboard()
    // Get chat users
    const members: UserInfo[] = await Promise.all(users.map(user => getUserInfo(bot.telegram, user)))
    // Prepare leaderboard
    const list = members.map(member => `${member.isUndefined ? `[${member.name}](tg://user?id=${member.chatId})` : `*${member.name}*`}: ${member.balance}`).join('\n')
    // Check if there were any undefined
    const undefinedExist = findIndex(members, 'isUndefined') > -1
    // Prepare text
    let text = `🏆 Топ Мемолиархов 🏆\n\n${list}`
    // Add undefined description
    if (undefinedExist) {
      text = `${text}\n\n"Неопределенный гаражанин" — это ограничения Телеграма, мы не смогли получить сейчас его данные. Однако ссылка на этого пользователя есть!`
    }
    // Reply
    ctx.replyWithMarkdown(text)
  })
}