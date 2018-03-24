import * as React from 'react'
import styled from 'styled-components'
import aqua from './chessIcons/aqua'
import black from './chessIcons/black'
import blue from './chessIcons/blue'
import green from './chessIcons/green'
import grey from './chessIcons/grey'
import orange from './chessIcons/orange'
import purple from './chessIcons/purple'
import red from './chessIcons/red'
import white from './chessIcons/white'
import yellow from './chessIcons/yellow'
import { ChessPiece, Colour, Team } from '../constants'
import { ITileState, IChessIconSet, ITeamInfo } from '../interfaces'

const FilledImage = styled.img`
	height: 80%;
	width: 80%;
`

const colourMap: Map<Colour, IChessIconSet> = new Map([
	[Colour.Aqua, aqua],
	[Colour.Black, black],
	[Colour.Blue, blue],
	[Colour.Green, green],
	[Colour.Grey, grey],
	[Colour.Orange, orange],
	[Colour.Purple, purple],
	[Colour.Red, red],
	[Colour.White, white],
	[Colour.Yellow, yellow],
])

const getIcon = (piece: ChessPiece, set?: IChessIconSet) => {
	if (!set) {
		return ''
	}
	// tslint:disable-next-line:no-any
	const map: Map<ChessPiece, any> = new Map([
		[ChessPiece.Empty, ''],
		[ChessPiece.Pawn, set.pawn],
		[ChessPiece.Bishop, set.bishop],
		[ChessPiece.Knight, set.knight],
		[ChessPiece.Rook, set.rook],
		[ChessPiece.Queen, set.queen],
		[ChessPiece.King, set.king],
	])
	return map.get(piece)
}

interface IChessIconProps {
	tile: ITileState
	teamInfo: Map<Team, ITeamInfo>
}

const ChessIcon: React.SFC<IChessIconProps> = props => {
	const { chessPiece, fogOfWar, team } = props.tile
	if (!chessPiece) {
		return null
	}
	if (fogOfWar) {
		return null
	}
	const teamInfo = props.teamInfo.get(team)
	const icon = teamInfo ? getIcon(props.tile.chessPiece, colourMap.get(teamInfo.colour)) : ''
	return <FilledImage src={icon} />
}
export default ChessIcon
