import { ChessPiece, Player } from './constants'
import Coord from './Coord'
import { Grid, IPieceInfo, ITileState } from './interfaces'

export const isValid = (x: number): boolean => x >= 0 && x < 8
const isFree = (tile: ITileState, fogOfWar?: boolean): boolean => !!(!tile.pieceInfo || (tile.fogOfWar && fogOfWar))

const addValidMove = (moves: Coord[], newTile: ITileState, player: Player, fogOfWar?: boolean): boolean => {
	// Valid if in fog of war - continues moving
	if (fogOfWar && newTile.fogOfWar) {
		moves.push(newTile.coord)
		return true
	}

	// Piece in the way - stops moving
	if (newTile.pieceInfo) {
		if (newTile.pieceInfo.player !== player) {
			moves.push(newTile.coord)
		}
		return false
	}

	// Nothing in the way - continues moving
	moves.push(newTile.coord)
	return true
}

const findPawnMoves = (piece: IPieceInfo, grid: Grid, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = piece.coord.getCoords()
	// Todo: Enpasse

	// Single-step and double-step moves
	const ssY = (piece.player === Player.One) ? y - 1 : y + 1
	const dsY = (piece.player === Player.One) ? y - 2 : y + 2

	// Check if single-step move is possible
	const ssTile = grid[ssY][x]
	if (isFree(ssTile, fogOfWar)) {
		moves.push(ssTile.coord)

		// Check if double-step move is possible
		if (!piece.hasMoved) {
			const dsTile = grid[dsY][x]
			if (isFree(dsTile, fogOfWar)) {
				moves.push(dsTile.coord)
			}
		}
	}

	// Diagonal capture - Able to move if forward-diagonal contains enemy piece
	for (const newX of [x - 1, x + 1]) {
		if (isValid(newX) && grid[ssY][newX].pieceInfo && grid[newX][ssY].pieceInfo!.player !== piece.player) {
			moves.push(new Coord(newX, ssY))
		}
	}

	return moves
}

const findBishopMoves = (piece: IPieceInfo, grid: Grid, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = piece.coord.getCoords()

	let tl = true
	let tr = true
	let bl = true
	let br = true
	for (let i = 1; i < 8; i++) {
		const xl = x - i
		const xr = x + i
		const yt = y - i
		const yb = y + i

		// Check bounds
		if (!isValid(xl)) {
			tl = false
			bl = false
		}
		if (!isValid(xr)) {
			tr = false
			br = false
		}
		if (!isValid(yt)) {
			tl = false
			tr = false
		}
		if (!isValid(yb)) {
			bl = false
			br = false
		}

		// Top Left
		if (tl) {
			const newTile = grid[yt][xl]
			tl = addValidMove(moves, newTile, piece.player, fogOfWar)
		}

		// Top Right
		if (tr) {
			const newTile = grid[yt][xr]
			tr = addValidMove(moves, newTile, piece.player, fogOfWar)
		}

		// Bottom Left
		if (bl) {
			const newTile = grid[yb][xl]
			bl = addValidMove(moves, newTile, piece.player, fogOfWar)
		}

		// Bottom Right
		if (br) {
			const newTile = grid[yb][xr]
			br = addValidMove(moves, newTile, piece.player, fogOfWar)
		}
	}

	return moves
}

const findKnightMoves = (piece: IPieceInfo, grid: Grid, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = piece.coord.getCoords()

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

	for (const [newX, newY] of coords) {
		if (isValid(newX) && isValid(newY)) {
			addValidMove(moves, grid[newY][newX], piece.player, fogOfWar)
		}
	}

	return moves
}

const findRookMoves = (piece: IPieceInfo, grid: Grid, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = piece.coord.getCoords()

	let top = true
	let bottom = true
	let left = true
	let right = true
	for (let i = 1; i < 8; i++) {
		// Top
		if (top && isValid(y - i)) {
			const newTile = grid[y - i][x]
			top = addValidMove(moves, newTile, piece.player, fogOfWar)
		}

		// Bottom
		if (bottom && isValid(y + i)) {
			const newTile = grid[y + i][x]
			bottom = addValidMove(moves, newTile, piece.player, fogOfWar)
		}

		// Left
		if (left && isValid(x - i)) {
			const newTile = grid[y][x - i]
			left = addValidMove(moves, newTile, piece.player, fogOfWar)
		}

		// Right
		if (right && isValid(x + i)) {
			const newTile = grid[y][x + i]
			right = addValidMove(moves, newTile, piece.player, fogOfWar)
		}
	}

	return moves
}

const findQueenMoves = (piece: IPieceInfo, grid: Grid, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = [
		...findBishopMoves(piece, grid, fogOfWar),
		...findRookMoves(piece, grid, fogOfWar),
	]
	return moves
}

const findKingMoves = (piece: IPieceInfo, grid: Grid, fogOfWar?: boolean): Coord[] => {
	const moves: Coord[] = []
	const [x, y] = piece.coord.getCoords()

	// Todo: castle
	const xl = x - 1
	const xr = x + 1
	const yt = y - 1
	const yb = y + 1
	const coords = [
		[xl, yt], [x, yt], [xr, yt],
		[xl, y],           [xr, y],
		[xl, yb], [x, yb], [xr, yb],
	]

	for (const [newX, newY] of coords) {
		if (isValid(newX) && isValid(newY)) {
			addValidMove(moves, grid[newY][newX], piece.player, fogOfWar)
		}
	}

	return moves
}

export const findAvailableMoves = (piece: IPieceInfo, grid: Grid, fogOfWar?: boolean): Coord[] => {
	switch (piece.chessPiece) {
		case ChessPiece.Empty:
			return []
		case ChessPiece.Pawn:
			return findPawnMoves(piece, grid, fogOfWar)
		case ChessPiece.Bishop:
			return findBishopMoves(piece, grid, fogOfWar)
		case ChessPiece.Knight:
			return findKnightMoves(piece, grid, fogOfWar)
		case ChessPiece.Rook:
			return findRookMoves(piece, grid, fogOfWar)
		case ChessPiece.Queen:
			return findQueenMoves(piece, grid, fogOfWar)
		case ChessPiece.King:
			return findKingMoves(piece, grid, fogOfWar)
		default:
			return []
	}
}
