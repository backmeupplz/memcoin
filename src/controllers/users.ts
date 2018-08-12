// Import only what we need from express
import { Router, Request, Response } from 'express'
import { getUserInfo } from '../helpers/leaderboard'
import { getUser } from '../models'

// Assign router to the express.Router() instance
const router: Router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  let { id } = req.params
  const user = await getUser(id)
  const member = await getUserInfo(res.bot, user)
  res.json(member)
})

export const UsersController: Router = router
