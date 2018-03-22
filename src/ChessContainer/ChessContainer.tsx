import * as React from 'react'
import * as SUI from 'semantic-ui-react'
import ChessGrid from './components/ChessGrid'
import { getFOWBoardState, updateFOW } from './gameState'
import { Team } from './constants'
import { IGameState, ITileState, Coord, } from './interfaces'
import { findAvailableMoves } from './chessMoves'

interface IChessContainerProps {}

interface IChessContainerState {
	gameState: IGameState
	targetedTile: Coord | null
	selectedTile: ITileState | null
	availableMoves: Coord[]
}

export default class ChessContainer extends React.PureComponent<IChessContainerProps, IChessContainerState> {
	// Store stuff that changes turn by turn in boardState
	// Store stuff that changes during turn in state
	state = {
		gameState: {
			boardState: getFOWBoardState(Team.A),
			playerTurn: Team.A,
		},
		targetedTile: null,
		selectedTile: null,
		availableMoves: []
	}

	componentDidUpdate(prevProps: IChessContainerProps, prevState: IChessContainerState) {
		// New turn, update boardState and history
		if (this.state.gameState.playerTurn !== prevState.gameState.playerTurn) {
			const gameState = {
				...this.state.gameState,
				boardState: updateFOW(this.state.gameState)
			}
			this.setState({ gameState })
		}
	}

	changeTargeted = (c: Coord): void => this.setState({ targetedTile: c })
	removeTargeted = (): void => this.setState({ targetedTile: null })

	changeSelected = (tile: ITileState): void => {
		if (tile.fogOfWar) {
			this.setState({ selectedTile: null, availableMoves: [] })			
		} else {
			const availableMoves = findAvailableMoves(tile, this.state.gameState)
			this.setState({ selectedTile: tile, availableMoves })
		}
	}
	removeSelected = (): void => this.setState({ selectedTile: null, availableMoves: [] })

	render() {
		return (
			<SUI.Container text style={{marginTop: '2em'}}>
				<SUI.Header as="h1">Shadow Chess</SUI.Header>
				<ChessGrid
					gameState={this.state.gameState}
					targetedTile={this.state.targetedTile}
					selectedTile={this.state.selectedTile}
					availableMoves={this.state.availableMoves}
					changeTargeted={this.changeTargeted}
					removeTargeted={this.removeTargeted}
					changeSelected={this.changeSelected}
					removeSelected={this.removeSelected}
				/>
				<SUI.Header as="h3">Turn: {this.state.gameState.playerTurn}</SUI.Header>
			</SUI.Container>
		)
	}
}
// <ChessPieces gameState={this.state.gameState} />
