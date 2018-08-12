// Dependencies
import * as express from 'express'
import { Telegraf, ContextMessageUpdate } from 'telegraf'
import { telegraphMiddlware, auth } from './middlewares'

import { UserRoute, TransferRoute } from './routes'

export function setupAPI(bot: Telegraf<ContextMessageUpdate>) {
  // Create a new express application instance
  const app: express.Application = express()
  // The port the express app will listen on
  const port = process.env.PORT || 3000

  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(auth)
  // use telegraph
  app.use(telegraphMiddlware(bot))
  // controllers
  app.use('/user', UserRoute)
  app.use('/transfer', TransferRoute)

  // Serve the application at the given port
  app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`)
  })
}