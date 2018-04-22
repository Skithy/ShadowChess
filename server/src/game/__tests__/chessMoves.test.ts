import { findAvailableMoves } from '../chessMoves'
import { ChessPiece, Player } from '../constants'
import Coord from '../Coord'
import { newGrid } from '../helpers'
import { Grid, IPieceInfo } from '../interfaces'

const newPiece = (chessPiece: ChessPiece, player: Player, coord: Coord): IPieceInfo => ({
	chessPiece,
	coord,
	hasMoved: false,
	isAlive: true,
	player,
	possibleMoves: [],
})

describe('chessMoves', () => {
	let grid: Grid
	beforeEach(() => {
		grid = newGrid(8)
	})

	describe('pawn', () => {
		describe('can go forward 2 moves if first move', () => {
			test('Player 1', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 6))
				const moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(2)
				expect(moves).toContainEqual([2, 5])
				expect(moves).toContainEqual([2, 4])
				expect(moves).toMatchSnapshot()
			})

			test('Player 2', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 1))
				const moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(2)
				expect(moves).toContainEqual([2, 2])
				expect(moves).toContainEqual([2, 3])
				expect(moves).toMatchSnapshot()
			})
		})

		describe('can go forward 1 move if not first move', () => {
			test('Player 1', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 5))
				pawn.hasMoved = true
				const moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(1)
				expect(moves).toContainEqual([2, 4])
				expect(moves).toMatchSnapshot()
			})

			test('Player 2', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 2))
				pawn.hasMoved = true
				const moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(1)
				expect(moves).toContainEqual([2, 3])
				expect(moves).toMatchSnapshot()
			})
		})

		describe('cant go forward if blocked by any piece', () => {
			test('Player 1 - single move', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 6))
				grid[5][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 5))

				expect(findAvailableMoves(pawn, grid).length).toBe(0)
				grid[5][2].pieceInfo!.player = Player.Two
				expect(findAvailableMoves(pawn, grid).length).toBe(0)
			})

			test('Player 1 - double move', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 6))
				grid[4][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 4))

				expect(findAvailableMoves(pawn, grid).length).toBe(1)
				grid[4][2].pieceInfo!.player = Player.Two
				expect(findAvailableMoves(pawn, grid).length).toBe(1)
			})

			test('Player 2 - single move', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 1))
				grid[2][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 2))

				let moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(0)

				grid[2][2].pieceInfo!.player = Player.One
				moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(0)
			})

			test('Player 2 - double move', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 1))
				grid[3][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 3))

				let moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(1)

				grid[3][2].pieceInfo!.player = Player.One
				moves = findAvailableMoves(pawn, grid).map((coord) => coord.getCoords())
				expect(moves.length).toBe(1)
			})
		})

		describe('can go forward if blocked but in fog of war', () => {
			test('Player 1 - single space', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 6))
				grid[5][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 5))
				grid[5][2].fogOfWar = true
				expect(findAvailableMoves(pawn, grid, true).length).toBe(2)
			})

			test('Player 1 - double space', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 6))
				grid[4][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 4))
				grid[4][2].fogOfWar = true
				expect(findAvailableMoves(pawn, grid, true).length).toBe(2)
			})

			test('Player 2 - single space', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 1))
				grid[2][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 2))
				grid[2][2].fogOfWar = true
				expect(findAvailableMoves(pawn, grid, true).length).toBe(2)
			})

			test('Player 2 - double space', () => {
				const pawn = newPiece(ChessPiece.Pawn, Player.Two, new Coord(2, 1))
				grid[3][2].pieceInfo = newPiece(ChessPiece.Pawn, Player.One, new Coord(2, 3))
				grid[3][2].fogOfWar = true
				expect(findAvailableMoves(pawn, grid, true).length).toBe(2)
			})
		})

		// describe('can take diagonal pieces', () => {

		// })

	})
})
