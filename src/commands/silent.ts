// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { getUser } from '../models'

// Balance command
export function setupSilent(bot: Telegraf<ContextMessageUpdate>) {
  bot.command('silent', async (ctx) => {
    // Get user
    const user = await getUser(ctx.chat.id)
    user.silent = !user.silent
    await user.save()
    // Reply
    ctx.replyWithMarkdown(user.silent ? 'Отлично! Теперь я буду по-тише.' : 'Ура! Теперь я буду рассказывать про дары любви!')
  })
}
