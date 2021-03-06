// Get environment variables
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { Telegraf, ContextMessageUpdate } from 'telegraf'
const telegraf = require('telegraf')
import { setupHelp } from './commands/help'
import { setupLeaderboard } from './commands/leaderboard'
import { setupBalance } from './commands/balance'
import { setupToken } from './commands/token'
import { setupTransfer } from './helpers/transfer'
import { setupAPI } from './server'
import { checkTime } from './helpers/middleware'
import { setupSilent } from './commands/silent'

// Setup the bot
const bot: Telegraf<ContextMessageUpdate> = new telegraf(process.env.TOKEN, {
  username: process.env.USERNAME,
})
bot.startPolling()
bot.catch((err: any) => {
  console.error(err)
})

// Setup middlewares
bot.use(checkTime)
// Setup help command
setupHelp(bot)
setupLeaderboard(bot)
setupBalance(bot)
setupToken(bot)
setupSilent(bot)

// Setup transfer
setupTransfer(bot)

// Run API server
setupAPI(bot.telegram)
