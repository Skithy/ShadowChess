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

const getIconSize = (props: IFilledImageProps) => props.larger ? '90%' : '80%'

interface IFilledImageProps {
	larger?: boolean
}

const FilledImage = styled.img`
	height: ${getIconSize};
	width: ${getIconSize};
	user-select: none;
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
	fogOfWarEnabled?: boolean
}

const ChessIcon: React.SFC<IChessIconProps> = props => {
	const { teamInfo, tile: { chessPiece, fogOfWar, team, } } = props
	if (!chessPiece) {
		return null
	}
	if (props.fogOfWarEnabled && fogOfWar) {
		return null
	}
	const teamDetails = teamInfo.get(team)
	const icon = teamDetails ? getIcon(chessPiece, colourMap.get(teamDetails.colour)) : ''
	return <FilledImage src={icon} larger={chessPiece === ChessPiece.Queen || chessPiece === ChessPiece.King}/>
}
export default ChessIcon
