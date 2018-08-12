// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'

// Help command
export function setupHelp(bot: Telegraf<ContextMessageUpdate>) {
  bot.command(['start', 'help'], (ctx) => {
    // Prepare text
    const text = `Дароуствуйте! Это бот Мемкономики.\n\n/help — это сообщение.\n/balance — ваш баланс в Мемкоинах.\n\nЕсли хотите перевести кому-нибудь Мемкоинов или выпустить новые (и у вас есть на это права), просто ответьте на сообщение человеку плюсом, сколько будет плюсов, столько и переведете.\n\n*Боже, храни Мемарха!*`
    // Reply
    ctx.replyWithMarkdown(text)
  })
}