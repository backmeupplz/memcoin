// Dependencies
import { Router } from 'express'
import { getUser } from '../../models'
import { transfer } from '../../helpers/transfer'

// Assign router to the express.Router() instance
const router: Router = Router()

router.post('/', async (req, res) => {
  const { senderId, receiverId } = req.body
  const amount = parseInt(req.body.amount, 10)
  const sender = await getUser(senderId)
  const receiver = await getUser(receiverId)
  try {
    await transfer(sender, receiver, amount)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json(error)
  }
})

export const TransferRoute = router
