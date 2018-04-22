import * as express from 'express'
import * as http from 'http'
import * as uuidv4 from 'uuid/v4'
import { Server } from 'ws'

import { IClient, id } from './interfaces'

const app = express()
const server = http.createServer(app)
const wss = new Server({ server })

const clients: Map<string, IClient> = new Map()
const queue: IClient[] = []
const matches: string[] = []

wss.on('connection', (ws: IClient, req: http.IncomingMessage) => {
	ws.isAlive = true
	ws.id = uuidv4()
	clients.set(ws.id, ws)
	console.log(`New connection - ${ws.id}`)

	ws.on('close', () => {
		console.log(`Closed connection - ${ws.id}`)
		clients.delete(ws.id)
	})

	ws.on('pong', () => {
		ws.isAlive = true
	})

	ws.on('message', (message: string) => {
		clients.forEach((client: IClient) => {
			client.send(message)
		})
	})
})

const pingClients = () => {
	clients.forEach((ws: IClient) => {
		if (!ws.isAlive) {
			console.log(`Dead connection - ${ws.id}`)
			clients.delete(ws.id)
			return ws.terminate()
		}
		ws.isAlive = false
		ws.ping()
	})
}

setInterval(pingClients, 5000)

server.listen(process.env.PORT || 8999, () => {
	console.log(`Server started on port ${server.address().port}`)
})
