// Import only what we need from express
import { Router, Request, Response } from 'express'
import { getUserInfo } from '../../helpers/leaderboard'
import { getUser } from '../../models'

// Assign router to the express.Router() instance
const router: Router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  try {
    let { id } = req.params
    const user = await getUser(id)
    const member = await getUserInfo(res.bot, user)
    res.json({
      success: true,
      member,
    })
  } catch(e) {
    res.status(500).json({
      type: 'UnknowedError',
    })
  }
})

export const UserController: Router = router
