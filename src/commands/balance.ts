// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getUser } from '../models'
import { getName } from '../helpers/name'

// Help commands
export function setupBalance(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('balance', async (ctx) => {
    // Get user
    const user = await getUser(ctx.from.id)
    // Get chat user
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id)
    // Prepare text
    let text = `Дароу, *${getName(member)}*! Твой баланс *${user.balance}* Мемкоинов.`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}