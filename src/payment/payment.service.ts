import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout'
import dotenv from 'dotenv'

dotenv.config()

export class PaymentService {
	private readonly YouKassa: YooCheckout

	constructor() {
		this.YouKassa = new YooCheckout({
			shopId: process.env.SHOP_ID!,
			secretKey: process.env.YOUKASSA_KEY!,
		})
	}

	async createPayment(
		amount: string,
		currency: string,
		returnUrl: string,
		orderId: string,
		userId: string
	) {
		const idempotenceKey = Date.now().toString() + (Math.random() * 10000).toString()
		const createPayload: ICreatePayment = {
			amount: {
				value: amount,
				currency: currency,
			},
			payment_method_data: {
				type: 'bank_card',
			},
			confirmation: {
				type: 'redirect',
				return_url: returnUrl,
			},
			metadata: {
				orderId: orderId,
				userId: userId,
			},
		}
		return this.YouKassa.createPayment(createPayload, idempotenceKey)
	}
}
