import { findAvailableMoves, isValid } from './chessMoves'
import { ChessPiece, Player } from './constants'
import Coord from './Coord'
import { Grid, IGameInfo, IPieceInfo } from './interfaces'

const resetFOW = (grid: Grid): void => {
	for (const row of grid) {
		for (const tile of row) {
			tile.fogOfWar = true
		}
	}
}

const increasePawnFOW = (piece: IPieceInfo, grid: Grid): void => {
	const [x, y] = piece.coord.getCoords()
	const xl = x - 1
	const xr = x + 1
	const yt = y - 1
	const yt2 = y - 2
	const yb = y + 1
	const yb2 = y + 2

	let coords: number[][] = []
	if (piece.player === Player.One) {
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

	for (const [newX, newY] of coords) {
		if (isValid(newX) && isValid(newY)) {
			grid[newY][newX].fogOfWar = false
		}
	}
}

export const updateFOW = (gameInfo: IGameInfo, player: Player): void => {
	resetFOW(gameInfo.grid)
	for (const piece of gameInfo.pieces[player]) {
		if (!piece.isAlive) {
			continue
		}
		// You can see where you can move to
		const availableMoves = findAvailableMoves(piece, gameInfo.grid)
		for (const move of availableMoves) {
			const [newX, newY] = move.getCoords()
			gameInfo.grid[newY][newX].fogOfWar = false
		}
		// More vision for pawns
		if (piece.chessPiece === ChessPiece.Pawn) {
			increasePawnFOW(piece, gameInfo.grid)
		}
		// See yourself
		gameInfo.grid[piece.coord.y][piece.coord.x].fogOfWar = false
	}
}
