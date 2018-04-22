export default class Coord {
	public static compareCoord = (c1: Coord, c2: Coord): boolean => c1.x === c2.x && c1.y === c2.y

	public readonly x: number
	public readonly y: number

	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	public compare = (c: Coord): boolean => Coord.compareCoord(c, this)
	public getCoords = (): number[] => [this.x, this.y]
	public copy = (): Coord => new Coord(this.x, this.y)
}
