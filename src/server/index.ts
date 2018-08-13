// Dependencies
import * as express from 'express'
import { Telegram } from 'telegraf'
import { telegrafMiddlware, auth } from './middlewares'

import { UserRoute, TransferRoute } from './routes'

export function setupAPI(telegram: Telegram) {
  // Create a new express application instance
  const app: express.Application = express()
  // The port the express app will listen on
  const port = process.env.PORT || 3000

  // Process request
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  // Authenticate
  app.use(auth)
  // Attach telegram
  app.use(telegrafMiddlware(telegram))
  // Routes
  app.use('/user', UserRoute)
  app.use('/transfer', TransferRoute)

  // Serve the application at the given port
  app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`)
  })
}