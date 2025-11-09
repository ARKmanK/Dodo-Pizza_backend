import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'

interface ChatMessage {
	type: 'message'
	value: string
	role: 'user' | 'admin'
	timestamp: string
}

interface RevenueMessage {
	type: 'revenue'
	value: number
}

export class WebSocketService {
	private wss: WebSocketServer
	private chatClients: WebSocket[] = []
	private revenueClients: WebSocket[] = []
	private messages: ChatMessage[] = []
	private revenue: number = 9764167193

	constructor(server: any) {
		this.wss = new WebSocketServer({ server })
		this.init()
	}

	private init() {
		this.wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
			const path = request.url
			if (path === '/chat') {
				this.handleChatConnection(ws)
			} else if (path === '/revenue') {
				this.handleRevenueConnection(ws)
			} else {
				ws.close(1003, 'Unsupported path')
			}
		})
	}

	private handleChatConnection(ws: WebSocket) {
		this.chatClients.push(ws)
		console.log('New chat client connected')

		this.messages.forEach(msg => {
			try {
				ws.send(JSON.stringify(msg))
			} catch (error) {
				console.error('Failed to send message to chat client:', error)
			}
		})

		ws.on('message', (data: string) => {
			try {
				const message: ChatMessage = JSON.parse(data)
				if (message.type === 'message') {
					this.messages.push(message)
					this.broadcastChatMessage(message)
				}
			} catch (error) {
				console.error('Failed to handle chat message:', error)
			}
		})

		ws.on('close', () => {
			this.chatClients = this.chatClients.filter(client => client !== ws)
			console.log('Chat client disconnected')
		})

		ws.on('error', error => {
			console.error('Chat WebSocket error:', error)
		})
	}

	private handleRevenueConnection(ws: WebSocket) {
		this.revenueClients.push(ws)
		console.log('New revenue client connected')

		ws.send(JSON.stringify({ type: 'revenue', value: this.revenue } as RevenueMessage))

		ws.on('close', () => {
			this.revenueClients = this.revenueClients.filter(client => client !== ws)
			console.log('Revenue client disconnected')
		})

		ws.on('error', error => {
			console.error('Revenue WebSocket error:', error)
		})
	}

	private broadcastChatMessage(message: ChatMessage) {
		this.chatClients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				try {
					client.send(JSON.stringify(message))
				} catch (error) {
					console.error('Failed to broadcast chat message:', error)
				}
			}
		})
	}

	private broadcastRevenue() {
		const message = JSON.stringify({ type: 'revenue', value: this.revenue } as RevenueMessage)
		this.revenueClients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				try {
					client.send(message)
				} catch (error) {
					console.error('Failed to broadcast revenue:', error)
				}
			}
		})
	}

	public startRevenueUpdates() {
		setInterval(() => {
			this.revenue += Math.floor(Math.random() * 10000)
			this.broadcastRevenue()
		}, 5000)
	}
}
