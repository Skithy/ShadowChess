import * as React from 'react'
import ChessTile from './ChessTile'
import ChessIcon from './ChessIcon'
import { Team } from '../constants'
import { IGameState, ITileState, Coord, ITeamInfo } from '../interfaces'

interface IChessGridProps {
	gameState: IGameState
	ghostTile?: ITileState
	hoveredTile?: ITileState
	selectedTile?: ITileState
	hoveredMoves: Coord[]
	selectedMoves: Coord[]
	teamInfo: Map<Team, ITeamInfo>
	fogOfWarEnabled?: boolean
	changeHovered: (t: ITileState) => void
	removeHovered: () => void
	changeSelected: (t: ITileState) => void
}

const ChessGrid: React.SFC<IChessGridProps> = props => {
	const {
		ghostTile,
		hoveredTile,
		selectedTile,
		hoveredMoves,
		selectedMoves,
		teamInfo,
		fogOfWarEnabled,
		changeHovered,
		removeHovered,
		changeSelected,
		gameState: { boardState },
	} = props

	const chessGrid = boardState.map((row, i) => (
		<div key={i} style={{ display: 'flex' }}>
			{row.map(tile =>
				<ChessTile
					key={tile.coord.getKey()}
					onMouseEnter={() => changeHovered(tile)}
					onMouseLeave={removeHovered}
					onClick={() => changeSelected(tile)}

					ghost={!!ghostTile && ghostTile.coord.compare(tile.coord)}
					hovered={!!hoveredTile && hoveredTile.coord.compare(tile.coord)}
					selected={!!selectedTile && selectedTile.coord.compare(tile.coord)}
					hoveredMove={hoveredMoves.some(c => c.compare(tile.coord))}
					selectedMove={selectedMoves.some(c => c.compare(tile.coord))}
					dark={(tile.coord.x + tile.coord.y) % 2 === 0}
					fogOfWar={tile.fogOfWar}
				>
					<ChessIcon fogOfWarEnabled={fogOfWarEnabled} tile={tile} teamInfo={teamInfo} />
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
