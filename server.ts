import { createServer } from 'http'
import app from './app'
import { WebSocketService } from './src/websocket/websocket.service'

const httpServer = createServer(app)
const webSocketService = new WebSocketService(httpServer)
webSocketService.startRevenueUpdates()

const PORT = process.env.PORT || 4200
httpServer.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})

export { webSocketService }
