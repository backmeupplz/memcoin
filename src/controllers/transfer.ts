// Import only what we need from express
import { Router, Request, Response } from 'express'
import { transfer, ErrorTransfer } from '../helpers/transfer'
import { getUser } from '../models'
import { getUserInfo } from '../helpers/leaderboard'

// Assign router to the express.Router() instance
const router: Router = Router()

router.get('/sender/:senderId/receiver/:receiverId/amount/:amount', async (req: Request, res: Response) => {
  let { senderId, receiverId, amount } = req.params
  amount = parseInt(amount, 10)
  let senderdb = await getUser(senderId)
  let receiverdb = await getUser(receiverId)
  try {
    await transfer(senderdb, receiverdb, amount)
    const sender = await getUserInfo(res.bot, senderdb)
    const receiver = await getUserInfo(res.bot, receiverdb)
    res.json({
      success: true,
      receiver,
      sender,
      amount,
    })
  } catch (err) {
    if (err instanceof ErrorTransfer) {
      res.json({
        type: err.type,
        message: err.message,
      })
      return
    }
  }
})

export const TransferController: Router = router
