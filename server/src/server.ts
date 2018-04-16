import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

interface IWebSocket extends WebSocket {
	isAlive?: boolean
}

wss.on('connection', (ws: IWebSocket, req: http.IncomingMessage) => {
	ws.isAlive = true

	ws.on('pong', () => {
		ws.isAlive = true
	})

	ws.on('message', (message: string) => {
		console.log('received: %s', message)
		const broadcastRegex = /^broadcast\:/
		if (broadcastRegex.test(message)) {
			message = message.replace(broadcastRegex, '')
			wss.clients.forEach((client: IWebSocket) => {
				if (client !== ws) {
					client.send(`Hello, broadcast message -> ${message}`)
				}
			})
		} else {
			ws.send(`Hello, you sent -> ${message}`)
		}
	})

	console.log(req.connection.remoteAddress)
	ws.send('Hi there, I am a WebSocket server')
})

setInterval(() => {
	wss.clients.forEach((ws: IWebSocket) => {
		if (!ws.isAlive) {
			return ws.terminate()
		}
		ws.isAlive = false
		ws.ping()
	})
}, 5000)

server.listen(process.env.PORT || 8999, () => {
	console.log(`Server started on port ${server.address().port} :)`)
})
