import * as React from 'react'
import ChessTile from './ChessTile'
import { IGameState, ITileState, Coord, } from '../interfaces'
import { ChessPiece } from '../constants'

interface IChessGridProps {
	gameState: IGameState
	targetedTile: Coord | null
	selectedTile: ITileState | null
	availableMoves: Coord[]
	changeTargeted: (c: Coord) => void
	removeTargeted: () => void
	changeSelected: (t: ITileState) => void
	removeSelected: () => void
}

const renderChessPiece = (tile: ITileState): JSX.Element | null => {
	if (tile.chessPiece === ChessPiece.Empty) {
		return null
	}
	if (tile.fogOfWar) {
		return null
	}
	return <button>{tile.chessPiece},{tile.team}</button>
}

const ChessGrid: React.SFC<IChessGridProps> = props => {
	const {
		targetedTile,
		selectedTile,
		availableMoves,
		changeTargeted,
		removeTargeted,
		changeSelected,
		removeSelected,
		gameState: { boardState }
	} = props

	const checkSelected = (tile: ITileState): boolean => !!selectedTile
		&& selectedTile.chessPiece !== ChessPiece.Empty
		&& selectedTile.coord.compare(tile.coord)

	const handleHover = (tile: ITileState): void => {
		changeTargeted(tile.coord)
		changeSelected(tile)
	} 

	const handleLeave = (): void => {
		removeTargeted()
		removeSelected()
	}

	const chessGrid = boardState.map((row, i) => (
		<div key={i} style={{ display: 'flex' }}>
			{row.map(tile =>
				<ChessTile
					key={tile.coord.getKey()}
					onMouseEnter={() => handleHover(tile)}
					onMouseLeave={handleLeave}

					availableMove={availableMoves.some(c => c.compare(tile.coord))}
					dark={(tile.coord.x + tile.coord.y) % 2 === 0}
					fogOfWar={tile.fogOfWar}
					hover={!!targetedTile && targetedTile.compare(tile.coord)}
					selected={checkSelected(tile)}
				>
					{renderChessPiece(tile)}
				</ChessTile>
			)}
		</div>
	))

	return (
		<div>
			{chessGrid}
		</div>
	)
}
export default ChessGrid
