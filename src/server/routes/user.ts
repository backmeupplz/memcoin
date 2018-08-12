// Dependencies
import { Router } from 'express'
import { getUserInfo } from '../../helpers/leaderboard'
import { getUser } from '../../models'

// Assign router to the express.Router() instance
const router: Router = Router()

router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await getUser(id)
    const info = await getUserInfo(res.bot, user)
    res.json({
      success: true,
      user: info,
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

export const UserRoute = router
