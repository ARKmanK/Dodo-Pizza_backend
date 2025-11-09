import { Request, Response, Router } from 'express'
import { PaymentService } from './payment.service'

const paymentRouter = Router()
const paymentService = new PaymentService()

paymentRouter.post('/api/payment', async (req: Request, res: Response) => {
	try {
		const payment = await paymentService.createPayment(
			req.body.value,
			'RUB',
			'http://localhost:3000',
			req.body.orderId,
			req.body.userId
		)
		return res.json(payment)
	} catch (error) {
		console.error(error)
		const errorMessage = error instanceof Error ? error.message : 'Unknown error'
		return res.status(400).json({ error: errorMessage })
	}
})

paymentRouter.post('/api/payment/notifications', async (req: Request, res: Response) => {
	console.log(req.body)
	res.json({ status: 'OK' })
	/* try {
		console.log(req.body)
	} catch (error) {
		console.error(error)
	} */
})

export default paymentRouter
