import Coord from './Coord'
import { Grid, ITileState } from './interfaces'

export const newGrid = (size: number): Grid => (
	Array.from(Array(size)).map((row, y): ITileState[] =>
		Array.from(Array(size)).map((tile, x): ITileState =>
			({ coord: new Coord(x, y) }),
		),
	)
)
