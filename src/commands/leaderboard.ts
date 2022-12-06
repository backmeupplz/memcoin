// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import {
  getLeaderboard,
  UserInfo,
  getUserInfo,
  getCardinalLeaderboard,
} from '../models'
import { findIndex } from 'lodash'

// Leaderboard command
export function setupLeaderboard(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('leaderboard', async ctx => {
    // Get users leaderboard
    const users = await getLeaderboard()
    // Get chat users
    const members: UserInfo[] = await Promise.all(
      users.map(user => getUserInfo(bot.telegram, user))
    )
    // Prepare leaderboard
    const list = members
      .map(
        member =>
          `${
            member.isUndefined
              ? `[${member.name}](tg://user?id=${member.chatId})`
              : `*${member.name}*`
          }: ${member.balance}`
      )
      .join('\n')
    // Get cardinals leaderboard
    const cardinals = await getCardinalLeaderboard()
    // Get cardinals
    const cardinalsMembers: UserInfo[] = await Promise.all(
      cardinals.map(user => getUserInfo(bot.telegram, user))
    )
    // Prepare cardinals leaderboard
    const cardinalsList = cardinalsMembers
      .map(
        member =>
          `${
            member.isUndefined
              ? `[${member.name}](tg://user?id=${member.chatId})`
              : `*${member.name}*`
          }: ${member.balance}`
      )
      .join('\n')
    // Check if there were any undefined
    const undefinedExist =
      findIndex(members, 'isUndefined') > -1 ||
      findIndex(cardinalsMembers, 'isUndefined') > -1
    // Prepare text
    let text = `❤️ Топ любимых ❤️\n\n${list}\n\n🔥 Топ Кардиналок и Кардиналов Любви 🔥\n\n${cardinalsList}`
    // Add undefined description
    if (undefinedExist) {
      text = `${text}\n\n"Неопределенная личность" — это ограничения Телеграма, мы не смогли получить сейчас ее/его данные. Однако ссылка на эту/этого пользовательницу/пользователя есть!`
    }
    // Reply
    ctx.replyWithMarkdown(text)
  })
}
