// Import only what we need from express
import { Router, Request, Response } from 'express'
import { getUser } from '../../models'
import { transfer, ErrorTransfer } from '../../helpers/transfer'
import { getUserInfo } from '../../helpers/leaderboard'

// Assign router to the express.Router() instance
const router: Router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body
  const amount = parseInt(req.body.amount, 10)
  let sender = await getUser(senderId)
  let receiver = await getUser(receiverId)
  try {
    await transfer(sender, receiver, amount)
    res.json({
      success: true,
    })
  } catch (err) {
    if (err instanceof ErrorTransfer) {
      res.json({
        type: err.type,
        message: err.message,
      })
    }
    res.status(500).json({
      type: 'UnknowedError',
    })
  }
})

export const TransferController: Router = router
