// Dependencies
import * as express from 'express'
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import {telegraphMiddlware} from './controllers/bot.middlaware'
import {auth} from './controllers/auth.middleware'

// Import WelcomeController from controllers entry point
import {UsersController, TransferController} from './controllers'

export function setupAPI(bot: Telegraf<ContextMessageUpdate>) {
  // Create a new express application instance
  const app: express.Application = express()
  // The port the express app will listen on
  const port: number | string = process.env.PORT || 3000

  // use telegraph
  app.use(telegraphMiddlware(bot))
  
  // Mount the UsersController at the /user route
  app.use(auth())
  app.use('/user', UsersController)
  app.use('/transfer', TransferController)

  // Serve the application at the given port
  app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`)
  })
}