import { findAvailableMoves } from './chessMoves'
import { ChessPiece, Player } from './constants'
import Coord from './Coord'
import { updateFOW } from './fow'
import { newGrid } from './helpers'
import { Grid, IGameInfo, IGameSettings, IPieceInfo, ITileState } from './interfaces'

// initGameInfo -> populateAllPossible -> generateGameInfos -> send to client
// await client move -> updateBoard -> populateAllPossible

const newPiece = (chessPiece: ChessPiece, player: Player, coord: Coord): IPieceInfo => ({
	chessPiece,
	coord,
	hasMoved: false,
	inCheck: false,
	isAlive: true,
	player,
	possibleMoves: [],
})

// Master GameInfo
// Grid and piece details
export const initGameInfo = (gameSettings: IGameSettings): IGameInfo => {
	// Setup Player One Pieces (Bottom/White)
	const playerOnePieces: IPieceInfo[] = [
		newPiece(ChessPiece.Rook,   Player.One, new Coord(0, 7)),
		newPiece(ChessPiece.Knight, Player.One, new Coord(1, 7)),
		newPiece(ChessPiece.Bishop, Player.One, new Coord(2, 7)),
		newPiece(ChessPiece.Queen,  Player.One, new Coord(3, 7)),
		newPiece(ChessPiece.King,   Player.One, new Coord(4, 7)),
		newPiece(ChessPiece.Bishop, Player.One, new Coord(5, 7)),
		newPiece(ChessPiece.Knight, Player.One, new Coord(6, 7)),
		newPiece(ChessPiece.Rook, 	Player.One, new Coord(7, 7)),
	]

	for (let i = 0; i < 8; i++) {
		playerOnePieces.push(newPiece(ChessPiece.Pawn, Player.One, new Coord(i, 6)))
	}

	// Setup Player Two Pieces (Top/Black)
	const playerTwoPieces: IPieceInfo[] = [
		newPiece(ChessPiece.Rook,   Player.Two, new Coord(0, 0)),
		newPiece(ChessPiece.Knight, Player.Two, new Coord(1, 0)),
		newPiece(ChessPiece.Bishop, Player.Two, new Coord(2, 0)),
		newPiece(ChessPiece.Queen,  Player.Two, new Coord(3, 0)),
		newPiece(ChessPiece.King,   Player.Two, new Coord(4, 0)),
		newPiece(ChessPiece.Bishop, Player.Two, new Coord(5, 0)),
		newPiece(ChessPiece.Knight, Player.Two, new Coord(6, 0)),
		newPiece(ChessPiece.Rook,   Player.Two, new Coord(7, 0)),
	]

	for (let i = 0; i < 8; i++) {
		playerOnePieces.push(newPiece(ChessPiece.Pawn, Player.Two, new Coord(i, 1)))
	}

	const pieces: IPieceInfo[][] = [playerOnePieces, playerTwoPieces]

	// New Grid
	const grid: Grid = newGrid(8)

	for (const playerPieces of pieces) {
		for (const piece of playerPieces) {
			const [x, y] = piece.coord.getCoords()
			grid[y][x].pieceInfo = piece
		}
	}

	return {
		grid,
		pieces,
		playerTurn: Player.One,
	}
}

export const populateAllPossibleMoves = (gameInfo: IGameInfo): void => {
	for (const pieces of gameInfo.pieces) {
		for (const piece of pieces) {
			piece.possibleMoves = findAvailableMoves(piece, gameInfo.grid)
		}
	}

	const king1 = gameInfo.pieces[Player.One].find((piece) => piece.chessPiece === ChessPiece.King)
	if (king1) {
		king1.inCheck = isChecked(king1.coord, gameInfo.pieces[Player.Two])
	}

	const king2 = gameInfo.pieces[Player.Two].find((piece) => piece.chessPiece === ChessPiece.King)
	if (king2) {
		king2.inCheck = isChecked(king2.coord, gameInfo.pieces[Player.One])
	}
}

export const generatePlayerGameInfo = (masterGI: IGameInfo, player: Player, gameSettings: IGameSettings): IGameInfo => {
	const gameInfo = {...masterGI}
	if (gameSettings.fogOfWar) {
		updateFOW(gameInfo, player)
		// Update possible moves for each enemy piece
		for (let i = 0; i < gameInfo.pieces.length; i++) {
			if (i === player) {
				continue
			}
			for (const piece of gameInfo.pieces[i]) {
				piece.possibleMoves = findAvailableMoves(piece, gameInfo.grid, true)
			}
		}
	}

	return gameInfo
}

// Can enemy kill coord?
export const isChecked = (coord: Coord, enemyPieces: IPieceInfo[]): boolean => {
	for (const piece of enemyPieces) {
		if (!piece.isAlive) {
			continue
		}
		for (const move of piece.possibleMoves) {
			if (move.compare(coord)) {
				return true
			}
		}
	}
	return false
}
