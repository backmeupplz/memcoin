// Dependencies
import { Router } from 'express'
import { getUser, getUserInfo } from '../../models'

const router = Router()

router.get('/:id', async (req, res) => {
  try {
    // Get id
    const { id } = req.params
    // Get user from db
    const user = await getUser(parseInt(id, 10))
    // Get user info with balance
    const info = await getUserInfo(req.telegram, user)
    // Respond with info
    res.json(info)
  } catch (error) {
    res.status(500).json(error)
  }
})

export const UserRoute = router
