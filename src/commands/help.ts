// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'

// Help command
export function setupHelp(bot: Telegraf<ContextMessageUpdate>) {
  bot.command(['start', 'help'], (ctx) => {
    // Prepare text
    const text = `Здравствуйте! Это бот, наполненный любовью.\n\n/help — это сообщение\n/balance — сколько у вас любви\n/leaderboard — топ любимых\n\nЕсли вы хотите выразить кому-нибудь свою любовь, просто ответьте на сообщение человеку плюсом или сердечком, сколько будет плюсов или сердечков, столько любви и придет получателю.\n\n*All you need is love!*`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}
