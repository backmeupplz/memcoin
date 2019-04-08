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

// Setup the bot
const bot: Telegraf<ContextMessageUpdate> = new telegraf(process.env.TOKEN, { username: process.env.USERNAME })
bot.startPolling()

// Setup help command
setupHelp(bot)
setupLeaderboard(bot)
setupBalance(bot)
setupToken(bot)

// Setup transfer
setupTransfer(bot)

// Run API server
setupAPI(bot.telegram)
