import { Id } from '../client/interfaces'
import { ChessPiece, Player } from './constants'
import Coord from './Coord'

// Chess Piece info
export interface IPieceInfo {
	chessPiece: ChessPiece
	player: Player
	coord: Coord
	possibleMoves: Coord[]
	isAlive: boolean
	hasMoved: boolean
	inCheck?: boolean
}

// Chess Tile info
export interface ITileState {
	pieceInfo?: IPieceInfo
	coord: Coord
	fogOfWar?: boolean
}

export type Grid = ITileState[][]
// A modified version of the game board for each player
export interface IGameInfo {
	grid: Grid
	pieces: IPieceInfo[][]
	playerTurn: Player
}

// Game modifications
export interface IGameSettings {
	fogOfWar: boolean
}

// Match results
export interface IMatchInfo {
	timeStarted: Date
	timeFinished: Date
	winner: Id
	turns: number
}

export interface IPlayerInfo {
	id: Id
	colour: string
}

export interface IMatch {
	players: Id[]
	matchInfo: IMatchInfo
	gameInfo: IGameInfo
	playerInfo: IPlayerInfo[]
	gameSettings: IGameSettings
}
