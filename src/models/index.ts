// Dependencies
import * as mongoose from 'mongoose'

// Connect to mongoose
mongoose.connect(process.env.MONGO, { useNewUrlParser: true })

// Get models
import { getUser, getLeaderboard } from './user'

// Export models
export {
  getUser,
  getLeaderboard,
}