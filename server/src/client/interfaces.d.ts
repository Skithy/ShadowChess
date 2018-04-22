import * as WebSocket from 'ws'

export type Id = string
export interface IClient extends WebSocket {
	isAlive: boolean
	id: Id
}
