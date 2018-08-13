// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getUser, getUserInfo } from '../models'

// Balance command
export function setupBalance(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('balance', async (ctx) => {
    // Get user
    const user = await getUser(ctx.from.id)
    // Get chat user
    const userInfo = await getUserInfo(ctx.telegram, user)
    // Prepare text
    const text = `Дароу, *${userInfo.name}*! Твой баланс *${userInfo.balance}* Мемкоинов.`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}