import { ITileState, IGameState, Coord } from './interfaces'
import { ChessPiece, Team } from './constants'

const findPawnMoves = (tile: ITileState, gameState: IGameState): Coord[] => {
	const moves: Coord[] = []
	const { boardState } = gameState
	const [x, y] = tile.coord.getCoords()
	// Todo: Enpasse
	if (tile.team === Team.A) {
		// Double-step
		if (y === 1) {
			if (boardState[y + 2][x].chessPiece === ChessPiece.Empty) {
				moves.push(new Coord(x, y + 2))
			}
		}
		// Single-step
		if (boardState[y + 1][x].chessPiece === ChessPiece.Empty) {
			moves.push(new Coord(x, y + 1))
		}
		// Diagonal capture
		if (x > 0 && boardState[y + 1][x - 1].team === Team.B) {
			moves.push(new Coord(x - 1, y + 1))
		}
		if (x < 7 && boardState[y + 1][x + 1].team === Team.B) {
			moves.push(new Coord(x + 1, y + 1))
		}
	} else {
		// Double-step
		if (y === 6) {
			if (boardState[y - 2][x].chessPiece === ChessPiece.Empty) {
				moves.push(new Coord(x, y - 2))
			}
		}
		// Single-step
		if (boardState[y - 1][x].chessPiece === ChessPiece.Empty) {
			moves.push(new Coord(x, y - 1))
		}
		// Diagonal capture
		if (x > 0 && boardState[y - 1][x - 1].team === Team.A) {
			moves.push(new Coord(x - 1, y - 1))
		}
		if (x < 7 && boardState[y - 1][x + 1].team === Team.A) {
			moves.push(new Coord(x + 1, y - 1))
		}
	}

	return moves
}

const findBishopMoves = (tile: ITileState, gameState: IGameState): Coord[] => {
	const moves: Coord[] = []
	const { boardState } = gameState
	const [x, y] = tile.coord.getCoords()

	let tl = true
	let tr = true
	let bl = true
	let br = true
	for (let i = 1; i < 8; i++) {
		// Check bounds
		if (x - i < 0) {
			tl = false
			bl = false
		}
		if (x + i >= 8) {
			tr = false
			br = false
		}
		if (y - i < 0) {
			tl = false
			tr = false
		}
		if (y + i >= 8) {
			bl = false
			br = false
		}

		// Top Left
		if (tl) {
			const newX = x - i
			const newY = y - i
			if (boardState[newY][newX].chessPiece) {
				if (boardState[newY][newX].team !== tile.team) {
					moves.push(new Coord(newX, newY))
				}
				tl = false
			} else {
				moves.push(new Coord(newX, newY))
			}
		}

		// Top Right
		if (tr) {
			const newX = x + i
			const newY = y - i
			if (boardState[newY][newX].chessPiece) {
				if (boardState[newY][newX].team !== tile.team) {
					moves.push(new Coord(newX, newY))
				}
				tr = false
			} else {
				moves.push(new Coord(x - i, y - i))
			}
		}

		// Bottom Left
		if (bl) {
			const newX = x - i
			const newY = y + i
			if (boardState[newY][newX].chessPiece) {
				if (boardState[newY][newX].team !== tile.team) {
					moves.push(new Coord(newX, newY))
				}
				bl = false
			} else {
				moves.push(new Coord(newX, newY))
			}
		}

		// Bottom Right
		if (br) {
			const newX = x + i
			const newY = y + i
			if (boardState[newY][newX].chessPiece) {
				if (boardState[newY][newX].team !== tile.team) {
					moves.push(new Coord(newX, newY))
				}
				br = false
			} else {
				moves.push(new Coord(newX, newY))
			}
		}
	}

	return moves
}

const findKnightMoves = (tile: ITileState, gameState: IGameState): Coord[] => {
	const moves: Coord[] = []
	const { boardState } = gameState
	const [x, y] = tile.coord.getCoords()

	const xl1 = x - 1
	const xl2 = x - 2
	const xr1 = x + 1
	const xr2 = x + 2
	const yt1 = y - 1
	const yt2 = y - 2
	const yb1 = y + 1
	const yb2 = y + 2
	
	const coords = [
		[xl2, yt1], [xl1, yt2], [xr1, yt2], [xr2, yt1],
		[xl2, yb1], [xl1, yb2], [xr1, yb2], [xr2, yb1],
	]

	for (let [newX, newY] of coords) {
		if (newX >= 0 && newX < 8
			&& newY >= 0 && newY < 8
			&& boardState[newY][newX].team !== tile.team) {
			moves.push(new Coord(newX, newY))
		}
	}

	return moves
}

const findRookMoves = (tile: ITileState, gameState: IGameState): Coord[] => {
	const moves: Coord[] = []
	const { boardState } = gameState
	const [x, y] = tile.coord.getCoords()

	let top = true
	let bottom = true
	let left = true
	let right = true
	for (let i = 1; i < 8; i++) {
		// Check bounds
		if (x - i < 0) {
			left = false
		}
		if (x + i >= 8) {
			right = false
		}
		if (y - i < 0) {
			top = false
		}
		if (y + i >= 8) {
			bottom = false
		}

		// Top
		if (top) {
			if (boardState[y - i][x].chessPiece !== ChessPiece.Empty) {
				if (boardState[y - i][x].team !== tile.team) {
					moves.push(new Coord(x, y - i))
				}
				top = false
			} else {
				moves.push(new Coord(x, y - i))
			}
		}

		// Bottom
		if (bottom) {
			if (boardState[y + i][x].chessPiece !== ChessPiece.Empty) {
				if (boardState[y + i][x].team !== tile.team) {
					moves.push(new Coord(x, y + i))
				}
				bottom = false
			} else {
				moves.push(new Coord(x, y + i))
			}
		}

		// Left
		if (left) {
			if (boardState[y][x - i].chessPiece !== ChessPiece.Empty) {
				if (boardState[y][x - i].team !== tile.team) {
					moves.push(new Coord(x - i, y))
				}
				top = false
			} else {
				moves.push(new Coord(x - i, y))
			}
		}

		// Right
		if (right) {
			if (boardState[y][x + i].chessPiece !== ChessPiece.Empty) {
				if (boardState[y][x + i].team !== tile.team) {
					moves.push(new Coord(x + i, y))
				}
				right = false
			} else {
				moves.push(new Coord(x + i, y))
			}
		}
	}

	return moves
}

const findQueenMoves = (tile: ITileState, gameState: IGameState): Coord[] => {
	const moves: Coord[] = [
		...findBishopMoves(tile, gameState),
		...findRookMoves(tile, gameState),
	]
	return moves
}

const findKingMoves = (tile: ITileState, gameState: IGameState): Coord[] => {
	const moves: Coord[] = []
	const { boardState } = gameState
	const [x, y] = tile.coord.getCoords()

	// Todo: castle
	const xl = x - 1
	const xr = x + 1
	const yt = y - 1
	const yb = y + 1
	const coords = [
		[xl, yt], [x, yt], [xr, yt],
		[xl, y], [], [xr, y],
		[xl, yb], [x, yb], [xr, yb],
	]

	for (let [newX, newY] of coords) {
		if (newX >= 0 && newX < 8
			&& newY >= 0 && newY < 8
			&& boardState[newY][newX].team !== tile.team) {
				moves.push(new Coord(newX, newY))
		}
	}

	return moves
}

export const findAvailableMoves = (tile: ITileState, gameState: IGameState): Coord[] => {
	switch (tile.chessPiece) {
		case ChessPiece.Empty:
			return []
		case ChessPiece.Pawn:
			return findPawnMoves(tile, gameState)
		case ChessPiece.Bishop:
			return findBishopMoves(tile, gameState)
		case ChessPiece.Knight:
			return findKnightMoves(tile, gameState)
		case ChessPiece.Rook:
			return findRookMoves(tile, gameState)
		case ChessPiece.Queen:
			return findQueenMoves(tile, gameState)
		case ChessPiece.King:
			return findKingMoves(tile, gameState)
		default:
			return []
	}
}
