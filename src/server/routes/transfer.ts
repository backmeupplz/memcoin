// Dependencies
import { Router, Request, Response } from 'express'
import { getUser } from '../../models'
import { transfer } from '../../helpers/transfer'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    // Get sender and receiver ids
    const { senderId, receiverId } = req.body
    // Get amount
    const amount = parseInt(req.body.amount, 10)
    // Get sender user
    const sender = await getUser(senderId)
    // Get receiver user
    const receiver = await getUser(receiverId)
    // Transfer amount
    await transfer(sender, receiver, amount)
    // Respond with success
    res.json({ success: true })
  } catch (error) {
    res.status(500).json(error)
  }
})

export const TransferRoute = router
