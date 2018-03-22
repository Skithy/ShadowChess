import { ChessPiece, Team } from './constants'

export class Coord {
	readonly x: number
	readonly y: number

	static compareCoord = (c1: Coord, c2: Coord) => c1.x === c2.x && c1.y === c2.y

	constructor (x: number, y: number) {
		this.x = x
		this.y = y
	}

	compare = (c: Coord): boolean => Coord.compareCoord(c, this)
	getKey = (): number => this.y * 8 + this.x
	getCoords = (): number[] => [this.x, this.y]
}

export interface ITileState {
	chessPiece: ChessPiece
	team: Team
	coord: Coord
	fogOfWar?: boolean
}

export type BoardState = ITileState[][]

export interface IGameState {
	boardState: BoardState
	playerTurn: Team
}
