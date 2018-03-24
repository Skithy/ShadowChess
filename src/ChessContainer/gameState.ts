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

const increasePawnFOW = (tile: ITileState, boardState: BoardState): void => {
	const [x, y] = tile.coord.getCoords()
	if (tile.team === Team.A) {
		// Double Move
		if (y === 1) {
			boardState[y + 2][x].fogOfWar = false
		}
		// Diagonals
		if (y + 1 < 8) {
			if (x - 1 >= 0) {
				boardState[y + 1][x - 1].fogOfWar = false
			}
			if (x + 1 < 8) {
				boardState[y + 1][x + 1].fogOfWar = false
			}
			boardState[y + 1][x].fogOfWar = false
		}
	} else {
		// Double move
		if (y === 6) {
			boardState[y - 2][x].fogOfWar = false
		}
		// Diagonals
		if (y - 1 >= 0) {
			if (x - 1 >= 0) {
				boardState[y - 1][x - 1].fogOfWar = false
			}
			if (x + 1 < 8) {
				boardState[y - 1][x + 1].fogOfWar = false
			}
			boardState[y - 1][x].fogOfWar = false
		}
	}
}

export const updateFOW = (gameState: IGameState, ghostTile?: ITileState | null): BoardState => {
	const { boardState, playerTurn } = gameState

	for (let row of resetFOW(boardState)) {
		for (let tile of row) {
			if (tile.chessPiece === ChessPiece.Empty || tile.team !== playerTurn) {
				continue
			}

			const availableMoves = findAvailableMoves(tile, gameState)
			for (let move of availableMoves) {
				const [ newX, newY ] = move.getCoords()
				boardState[newY][newX].fogOfWar = false
			}
			// More vision for pawns
			if (tile.chessPiece === ChessPiece.Pawn) {
				increasePawnFOW(tile, boardState)
			}
			// See yourself
			boardState[tile.coord.y][tile.coord.x].fogOfWar = false
		}
	}

	if (ghostTile) {
		const availableMoves = findAvailableMoves(ghostTile, gameState)
		for (let move of availableMoves) {
			const [newX, newY] = move.getCoords()
			boardState[newY][newX].fogOfWar = false
		}
		// More vision for pawns
		if (ghostTile.chessPiece === ChessPiece.Pawn) {
			increasePawnFOW(ghostTile, boardState)
		}
		// See yourself
		boardState[ghostTile.coord.y][ghostTile.coord.x].fogOfWar = false
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

export const updateBoardState = (oldTile: ITileState, newTile: ITileState, boardState: BoardState): BoardState => {
	const { coord, team, chessPiece } = oldTile
	const [ oldX, oldY ] = coord.getCoords()
	const [ newX, newY ] = newTile.coord.getCoords()

	boardState[newY][newX].chessPiece = chessPiece
	boardState[newY][newX].team = team

	boardState[oldY][oldX].chessPiece = ChessPiece.Empty
	boardState[oldY][oldX].team = Team.None
	return boardState
}