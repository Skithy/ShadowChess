import { ITileState, BoardState, IGameState, Coord } from './interfaces'
import { ChessPiece, Team } from './constants'
import { findAvailableMoves, isValid } from './chessMoves'

export const getDefaultBoardState = (): BoardState => {
	// New Board
	const defaultBoardState: BoardState = Array.from(Array(8)).map((row, y): ITileState[] =>
		Array.from(Array(8)).map((tile, x): ITileState =>
			({ chessPiece: ChessPiece.Empty, team: Team.None, coord: new Coord(x, y) })
		)
	)
	// Setup Team B (Top)
	defaultBoardState[0][0].chessPiece = ChessPiece.Rook
	defaultBoardState[0][1].chessPiece = ChessPiece.Knight
	defaultBoardState[0][2].chessPiece = ChessPiece.Bishop
	defaultBoardState[0][3].chessPiece = ChessPiece.Queen
	defaultBoardState[0][4].chessPiece = ChessPiece.King
	defaultBoardState[0][5].chessPiece = ChessPiece.Bishop
	defaultBoardState[0][6].chessPiece = ChessPiece.Knight
	defaultBoardState[0][7].chessPiece = ChessPiece.Rook
	for (let row of defaultBoardState[0]) {
		row.team = Team.B
	}
	for (let row of defaultBoardState[1]) {
		row.chessPiece = ChessPiece.Pawn
		row.team = Team.B
	}

	// Setup Team A (bottom)
	defaultBoardState[7][0].chessPiece = ChessPiece.Rook
	defaultBoardState[7][1].chessPiece = ChessPiece.Knight
	defaultBoardState[7][2].chessPiece = ChessPiece.Bishop
	defaultBoardState[7][3].chessPiece = ChessPiece.Queen
	defaultBoardState[7][4].chessPiece = ChessPiece.King
	defaultBoardState[7][5].chessPiece = ChessPiece.Bishop
	defaultBoardState[7][6].chessPiece = ChessPiece.Knight
	defaultBoardState[7][7].chessPiece = ChessPiece.Rook
	for (let row of defaultBoardState[7]) {
		row.team = Team.A
	}
	for (let row of defaultBoardState[6]) {
		row.chessPiece = ChessPiece.Pawn
		row.team = Team.A
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
	const xl = x - 1
	const xr = x + 1
	const yt = y - 1
	const yt2 = y - 2
	const yb = y + 1
	const yb2 = y + 2

	let coords: number[][] = []
	if (tile.team === Team.A) {
		coords = coords.concat([
			[xl, yt], [x, yt], [xr, yt],
			[xl, y], [xr, y],
		])
		if (x === 6) {
			coords.push([x, yt2])
		}
	} else {
		coords = coords.concat([
			[xl, y], [xr, y],
			[xl, yb], [x, yb], [xr, yb],
		])
		if (x === 1) {
			coords.push([x, yb2])
		}
	}

	for (let [newX, newY] of coords) {
		if (isValid(newX) && isValid(newY)) {
			boardState[newY][newX].fogOfWar = false
		}
	}
}

export const updateFOW = (gameState: IGameState, ghostTile?: ITileState | null): BoardState => {
	const { boardState, playerTurn } = gameState

	for (let row of resetFOW(boardState)) {
		for (let tile of row) {
			if (ghostTile && tile.coord.compare(ghostTile.coord)) {
				tile = ghostTile
			}

			// Only have friendly vision
			if (tile.team !== playerTurn) {
				continue
			}

			// You can see where you can move to
			const availableMoves = findAvailableMoves(tile, boardState)
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

	return boardState
}

export const checkChecked = (boardState: BoardState, playerTurn: Team): boolean => {
	let playerKing: ITileState | undefined
	let enemyMoves: Coord[] = []

	for (let row of boardState) {
		for (let tile of row) {
			if (!tile.team) {
				continue
			}
			if (tile.team === playerTurn && tile.chessPiece === ChessPiece.King) {
				playerKing = tile
			}
			if (tile.team !== playerTurn) {
				enemyMoves = enemyMoves.concat(findAvailableMoves(tile, boardState))
			}
		}
	}
	return enemyMoves.some(c => !!playerKing && c.compare(playerKing.coord))
}

export const getFOWBoardState = (team: Team): BoardState => {
	let boardState = getDefaultBoardState()
	boardState = resetFOW(boardState)

	const gameState: IGameState = {
		boardState: boardState,
		playerTurn: team,
		inCheck: checkChecked(boardState, team),
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