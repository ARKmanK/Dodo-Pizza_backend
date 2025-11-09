import express from 'express'
import helmet from 'helmet'
import paymentRouter from './src/payment/payment.controller'
import cors from 'cors'

const app = express()

app.use(
	cors({
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	})
)
app.use(helmet())
app.use(express.json())
app.use(paymentRouter)

export default app
