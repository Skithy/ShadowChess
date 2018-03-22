import { ITileState, BoardState, IGameState, Coord } from './interfaces'
import { ChessPiece, Team } from './constants'
import { findAvailableMoves } from './chessMoves'

export const getDefaultBoardState = (): BoardState => {
	const defaultBoardState: BoardState = Array.from(Array(8)).map((row, y): ITileState[] =>
		Array.from(Array(8)).map((tile, x): ITileState =>
			({ chessPiece: ChessPiece.Empty, team: Team.None, coord: new Coord(x, y) })
		)
	)
	defaultBoardState[0][0].chessPiece = ChessPiece.Rook
	defaultBoardState[0][1].chessPiece = ChessPiece.Knight
	defaultBoardState[0][2].chessPiece = ChessPiece.Bishop
	defaultBoardState[0][3].chessPiece = ChessPiece.King
	defaultBoardState[0][4].chessPiece = ChessPiece.Queen
	defaultBoardState[0][5].chessPiece = ChessPiece.Bishop
	defaultBoardState[0][6].chessPiece = ChessPiece.Knight
	defaultBoardState[0][7].chessPiece = ChessPiece.Rook
	for (let row of defaultBoardState[0]) {
		row.team = Team.A
	}
	for (let row of defaultBoardState[1]) {
		row.chessPiece = ChessPiece.Pawn
		row.team = Team.A
	}

	defaultBoardState[7][0].chessPiece = ChessPiece.Rook
	defaultBoardState[7][1].chessPiece = ChessPiece.Knight
	defaultBoardState[7][2].chessPiece = ChessPiece.Bishop
	defaultBoardState[7][3].chessPiece = ChessPiece.King
	defaultBoardState[7][4].chessPiece = ChessPiece.Queen
	defaultBoardState[7][5].chessPiece = ChessPiece.Bishop
	defaultBoardState[7][6].chessPiece = ChessPiece.Knight
	defaultBoardState[7][7].chessPiece = ChessPiece.Rook
	for (let row of defaultBoardState[7]) {
		row.team = Team.B
	}
	for (let row of defaultBoardState[6]) {
		row.chessPiece = ChessPiece.Pawn
		row.team = Team.B
	}

	return defaultBoardState
}

export const resetFOW = (boardState: BoardState): BoardState => {
	for (let row of boardState) {
		for (let tile of row) {
			tile.fogOfWar = true
		}
	}
	return boardState
}

export const updateFOW = (gameState: IGameState): BoardState => {
	const { boardState, playerTurn } = gameState
	for (let row of boardState) {
		for (let tile of row) {
			if (tile.chessPiece === ChessPiece.Empty || tile.team !== playerTurn) {
				continue
			}

			const availableMoves = findAvailableMoves(tile, gameState)
			for (let move of availableMoves) {
				const [ x, y ] = move.getCoords()
				boardState[y][x].fogOfWar = false
			}
			boardState[tile.coord.y][tile.coord.x].fogOfWar = false
		}
	}
	return boardState
}

export const getFOWBoardState = (team: Team): BoardState => {
	let boardState = getDefaultBoardState()
	boardState = resetFOW(boardState)

	const gameState: IGameState = {
		boardState: boardState,
		playerTurn: team,
	}
	boardState = updateFOW(gameState)
	return boardState
}
