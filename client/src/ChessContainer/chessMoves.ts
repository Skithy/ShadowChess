import { ITileState, BoardState, Coord } from './interfaces'
import { ChessPiece, Team } from './constants'

export const isValid = (x: number) => x >= 0 && x < 8

const addValidMove = (moves: Coord[], tile: ITileState, newTile: ITileState, fogOfWar?: boolean): boolean => {
	if (fogOfWar && newTile.fogOfWar) {
		moves.push(newTile.coord)
		return true
	}

	if (newTile.chessPiece) {
		if (newTile.team !== tile.team) {
			moves.push(newTile.coord)
		}
		return false
	}

	moves.push(newTile.coord)
	return true
}

const findPawnMoves = (tile: ITileState, boardState: BoardState, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = tile.coord.getCoords()
	// Todo: Enpasse
	if (tile.team === Team.B) {
		// Single-step
		const ssTile = boardState[y + 1][x]
		if (!ssTile.chessPiece || (fogOfWar && ssTile.fogOfWar)) {
			moves.push(ssTile.coord)
			// Double-step
			const dsTile = boardState[y + 2][x]
			if (y === 1 && (!dsTile.chessPiece || (fogOfWar && dsTile.fogOfWar))) {
				moves.push(dsTile.coord)
			}
		}

		// Diagonal capture
		if (isValid(x - 1) && boardState[y + 1][x - 1].team === Team.A) {
			moves.push(new Coord(x - 1, y + 1))
		}
		if (isValid(x + 1) && boardState[y + 1][x + 1].team === Team.A) {
			moves.push(new Coord(x + 1, y + 1))
		}
	} else {
		// Single-step
		const ssTile = boardState[y - 1][x]
		if (!ssTile.chessPiece || (fogOfWar && ssTile.fogOfWar)) {
			moves.push(ssTile.coord)
			// Double-step
			const dsTile = boardState[y - 2][x]
			if (y === 6 && (!dsTile.chessPiece || (fogOfWar && dsTile.fogOfWar))) {
				moves.push(dsTile.coord)
			}
		}

		// Diagonal capture
		if (isValid(x - 1) && boardState[y - 1][x - 1].team === Team.B) {
			moves.push(new Coord(x - 1, y - 1))
		}
		if (isValid(x + 1) && boardState[y - 1][x + 1].team === Team.B) {
			moves.push(new Coord(x + 1, y - 1))
		}
	}

	return moves
}

const findBishopMoves = (tile: ITileState, boardState: BoardState, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = tile.coord.getCoords()

	let tl = true
	let tr = true
	let bl = true
	let br = true
	for (let i = 1; i < 8; i++) {
		// Check bounds
		if (!isValid(x - i)) {
			tl = false
			bl = false
		}
		if (!isValid(x + i)) {
			tr = false
			br = false
		}
		if (!isValid(y - i)) {
			tl = false
			tr = false
		}
		if (!isValid(y + i)) {
			bl = false
			br = false
		}

		// Top Left
		if (tl) {
			const newTile = boardState[y - i][x - i]
			tl = addValidMove(moves, tile, newTile, fogOfWar)
		}

		// Top Right
		if (tr) {
			const newTile = boardState[y - i][x + i]
			tr = addValidMove(moves, tile, newTile, fogOfWar)
		}

		// Bottom Left
		if (bl) {
			const newTile = boardState[y + i][x - i]
			bl = addValidMove(moves, tile, newTile, fogOfWar)
		}

		// Bottom Right
		if (br) {
			const newTile = boardState[y + i][x + i]
			br = addValidMove(moves, tile, newTile, fogOfWar)
		}
	}

	return moves
}

const findKnightMoves = (tile: ITileState, boardState: BoardState, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
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
		if (isValid(newX) && isValid(newY)) {
			addValidMove(moves, tile, boardState[newY][newX], fogOfWar)
		}
	}

	return moves
}

const findRookMoves = (tile: ITileState, boardState: BoardState, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = tile.coord.getCoords()

	let top = true
	let bottom = true
	let left = true
	let right = true
	for (let i = 1; i < 8; i++) {
		// Top
		if (top && isValid(y - i)) {
			const newTile = boardState[y - i][x]
			top = addValidMove(moves, tile, newTile, fogOfWar)
		}

		// Bottom
		if (bottom && isValid(y + i)) {
			const newTile = boardState[y + i][x]
			bottom = addValidMove(moves, tile, newTile, fogOfWar)
		}

		// Left
		if (left && isValid(x - i)) {
			const newTile = boardState[y][x - i]
			left = addValidMove(moves, tile, newTile, fogOfWar)
		}

		// Right
		if (right && isValid(x + i)) {
			const newTile = boardState[y][x + i]
			right = addValidMove(moves, tile, newTile, fogOfWar)
		}
	}

	return moves
}

const findQueenMoves = (tile: ITileState, boardState: BoardState, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = [
		...findBishopMoves(tile, boardState, fogOfWar),
		...findRookMoves(tile, boardState, fogOfWar),
	]
	return moves
}

const findKingMoves = (tile: ITileState, boardState: BoardState, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
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
		if (isValid(newX) && isValid(newY)) {
			addValidMove(moves, tile, boardState[newY][newX], fogOfWar)
		}
	}

	return moves
}

export const findAvailableMoves = (tile: ITileState, boardState: BoardState, fogOfWar?: boolean): Coord[] => {
	switch (tile.chessPiece) {
		case ChessPiece.Empty:
			return []
		case ChessPiece.Pawn:
			return findPawnMoves(tile, boardState, fogOfWar)
		case ChessPiece.Bishop:
			return findBishopMoves(tile, boardState, fogOfWar)
		case ChessPiece.Knight:
			return findKnightMoves(tile, boardState, fogOfWar)
		case ChessPiece.Rook:
			return findRookMoves(tile, boardState, fogOfWar)
		case ChessPiece.Queen:
			return findQueenMoves(tile, boardState, fogOfWar)
		case ChessPiece.King:
			return findKingMoves(tile, boardState, fogOfWar)
		default:
			return []
	}
}
