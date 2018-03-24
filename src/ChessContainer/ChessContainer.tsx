import * as React from 'react'
import * as SUI from 'semantic-ui-react'
import ChessGrid from './components/ChessGrid'
import { getFOWBoardState, updateFOW, updateBoardState } from './gameState'
import { Team, Colour } from './constants'
import { IGameState, ITileState, Coord, ITeamInfo, } from './interfaces'
import { findAvailableMoves } from './chessMoves'

interface IChessContainerProps {}

interface IChessContainerState {
	gameState: IGameState
	ghostTile?: ITileState
	hoveredTile?: ITileState
	selectedTile?: ITileState
	hoveredMoves: Coord[]
	selectedMoves: Coord[]
	log: string[]
	teamInfo: Map<Team, ITeamInfo>
	gameHistory: IGameState[]
}

export default class ChessContainer extends React.PureComponent<IChessContainerProps, IChessContainerState> {
	// Store stuff that changes turn by turn in boardState
	// Store stuff that changes during turn in state
	state = {
		gameState: {
			boardState: getFOWBoardState(Team.A),
			playerTurn: Team.A,
		},
		hoveredMoves: [],
		selectedMoves: [],
		log: [],
		teamInfo: new Map([
			[Team.A, { colour: Colour.Black }],
			[Team.B, { colour: Colour.White }],			
		]),
		gameHistory: []
	} as IChessContainerState

	componentDidMount() {
		this.setState({ gameHistory: [this.state.gameState] })
	}

	componentDidUpdate(prevProps: IChessContainerProps, prevState: IChessContainerState) {
		// New turn, update boardState and history
		if (this.state.gameState.playerTurn !== prevState.gameState.playerTurn) {
			const gameState = {
				...this.state.gameState,
				boardState: updateFOW(this.state.gameState, this.state.ghostTile)
			}
			this.setState({
				gameState,
				hoveredTile: undefined,
				selectedTile: undefined,
				hoveredMoves: [],
				selectedMoves: [],
			})
		}
	}

	changeHovered = (tile: ITileState): void => {
		// Show available moves for pieces not in fog of war
		const moves = !tile.fogOfWar ? findAvailableMoves(tile, this.state.gameState, true) : []
		this.setState({ hoveredTile: tile, hoveredMoves: moves })
	}
	removeHovered = (): void => this.setState({ hoveredTile: undefined })

	changeSelected = (tile: ITileState): void => {
		const { selectedTile, selectedMoves, gameState: { playerTurn } } = this.state
		if (selectedTile && (selectedMoves as Coord[]).some(t => t.compare(tile.coord))) {
			// Move to selected tile
			this.handleMove(tile)
		} else if (tile.team !== playerTurn || tile === selectedTile) {
			// Cancel selected tile
			this.setState({ selectedTile: undefined, selectedMoves: [] })			
		} else {
			// Get available moves for tile
			const moves = findAvailableMoves(tile, this.state.gameState)
			this.setState({ selectedTile: tile, selectedMoves: moves })
		}
	}
	removeSelected = (): void => this.setState({ selectedTile: undefined, selectedMoves: [] })

	handleMove = (tile: ITileState): void => {
		const { selectedTile, log, gameState: { boardState, playerTurn } } = this.state
		if (!selectedTile) {
			return
		}

		let ghostTile: ITileState | undefined = undefined
		const updatedLog = [...log]
		if (tile.team && tile.team !== playerTurn) {
			ghostTile = {...tile}
			updatedLog.push(`${selectedTile.team}'s ${tile.chessPiece} captured ${tile.team}'s ${tile.chessPiece}`)
		}
		
		const gameState: IGameState = {
			boardState: updateBoardState(selectedTile, tile, boardState),
			playerTurn: playerTurn === Team.A ? Team.B : Team.A,
		}
		const gameHistory = [...this.state.gameHistory, { ...gameState }]
		this.setState({ gameState, ghostTile, log: updatedLog, gameHistory })
	}

	render() {
		return (
			<SUI.Container text style={{marginTop: '2em'}}>
				<SUI.Header as="h1">Shadow Chess</SUI.Header>
				<ChessGrid
					fogOfWarEnabled
					gameState={this.state.gameState}
					ghostTile={this.state.ghostTile}
					hoveredTile={this.state.hoveredTile}
					selectedTile={this.state.selectedTile}
					hoveredMoves={this.state.hoveredMoves}
					selectedMoves={this.state.selectedMoves}
					teamInfo={this.state.teamInfo}
					changeHovered={this.changeHovered}
					removeHovered={this.removeHovered}
					changeSelected={this.changeSelected}
				/>
				<SUI.Header as="h3">Turn: {this.state.gameState.playerTurn}</SUI.Header>
				<SUI.Header as="h3">Log: </SUI.Header>
				{this.state.log.map((l, i) =>
					<SUI.Header as="h4" key={i}>{l}</SUI.Header>
				)}
			</SUI.Container>
		)
	}
}
