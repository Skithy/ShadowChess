import * as React from 'react'
import * as SUI from 'semantic-ui-react'
import ChessGrid from './components/ChessGrid'
import AwaitPlayerScreen from './components/AwaitPlayerScreen'
import PausedScreen from './components/PausedScreen'
import { getFOWBoardState, updateFOW, updateBoardState, checkChecked } from './gameState'
import { Team, Colour, GameStatus, ChessPiece } from './constants'
import { IGameState, ITileState, Coord, ITeamInfo, } from './interfaces'
import { findAvailableMoves } from './chessMoves'

interface IChessContainerProps {}

interface IChessContainerState {
	gameStatus: GameStatus
	gameState: IGameState
	hoveredTile?: ITileState
	selectedTile?: ITileState
	hoveredMoves: Coord[]
	selectedMoves: Coord[]
	fogOfWarEnabled?: boolean
	log: string[]
	teamInfo: Map<Team, ITeamInfo>
	gameHistory: IGameState[]
}

export default class ChessContainer extends React.PureComponent<IChessContainerProps, IChessContainerState> {
	// Store stuff that changes turn by turn in boardState
	// Store stuff that changes during turn in state
	state = {
		gameStatus: GameStatus.AwaitP1,
		gameState: {
			boardState: getFOWBoardState(Team.A),
			playerTurn: Team.A,
			inCheck: false,
		},
		hoveredMoves: [],
		selectedMoves: [],
		log: [],
		teamInfo: new Map([
			[Team.A, { colour: Colour.Purple }],
			[Team.B, { colour: Colour.Green }],			
		]),
		gameHistory: [],
		fogOfWarEnabled: true,
	} as IChessContainerState

	componentDidMount() {
		this.setState({ gameHistory: [this.state.gameState] })
	}

	componentDidUpdate(prevProps: IChessContainerProps, prevState: IChessContainerState) {
		const { gameState, gameState: { boardState, playerTurn, ghostTile, }, gameHistory } = this.state
		// New turn, update boardState and history
		if (playerTurn !== prevState.gameState.playerTurn) {
			const newGameState: IGameState = {
				...gameState,
				boardState: updateFOW(gameState, ghostTile),
				inCheck: checkChecked(boardState, playerTurn),
			}
			this.setState({
				gameState: newGameState,
				hoveredTile: undefined,
				selectedTile: undefined,
				hoveredMoves: [],
				selectedMoves: [],
				gameHistory: [...gameHistory, {...newGameState}]
			})
		}
	}

	changeHovered = (tile: ITileState): void => {
		const { fogOfWarEnabled, gameState: { boardState } } = this.state
		// Show available moves for pieces not in fog of war
		let moves: Coord[] = []
		if (this.state.fogOfWarEnabled) {
			if (!tile.fogOfWar) {
				moves = findAvailableMoves(tile, boardState, fogOfWarEnabled)				
			}
		} else {
			moves = findAvailableMoves(tile, boardState, fogOfWarEnabled)
		}
		this.setState({ hoveredTile: tile, hoveredMoves: moves })
	}
	removeHovered = (): void => this.setState({ hoveredTile: undefined, hoveredMoves: [] })

	changeSelected = (tile: ITileState): void => {
		const { selectedTile, selectedMoves, gameState: { boardState, playerTurn } } = this.state
		if (selectedTile && (selectedMoves as Coord[]).some(t => t.compare(tile.coord))) {
			// Move to selected tile
			this.handleMove(tile)
		} else if (tile.team !== playerTurn || tile === selectedTile) {
			// Cancel selected tile
			this.setState({ selectedTile: undefined, selectedMoves: [] })			
		} else {
			// Get available moves for tile
			const moves = findAvailableMoves(tile, boardState)
			this.setState({ selectedTile: tile, selectedMoves: moves })
		}
	}
	removeSelected = (): void => this.setState({ selectedTile: undefined, selectedMoves: [] })

	toggleFogOfWar = (): void => this.setState({ fogOfWarEnabled: !this.state.fogOfWarEnabled })

	handleMove = (tile: ITileState): void => {
		const { selectedTile, gameState: { boardState, playerTurn } } = this.state
		// no tile selected??
		if (!selectedTile) {
			return
		}

		let gameOver = false
		let ghostTile: ITileState | undefined = undefined
		// Capture a piece
		if (tile.team && tile.team !== playerTurn) {
			if (tile.chessPiece === ChessPiece.King) {
				gameOver = true
			}
			ghostTile = {...tile}
		}
		
		const gameState: IGameState = {
			boardState: updateBoardState(selectedTile, tile, boardState),
			playerTurn: playerTurn === Team.A ? Team.B : Team.A,
			inCheck: false,
			ghostTile
		}
		const gameStatus = gameOver
			? GameStatus.Paused
			: gameState.playerTurn === Team.A ? GameStatus.AwaitP1 : GameStatus.AwaitP2
		this.setState({gameState, gameStatus })
	}

	displayScreen = (): JSX.Element | null => {
		switch (this.state.gameStatus) {
			case GameStatus.Game:
				return (
					<ChessGrid
						fogOfWarEnabled={this.state.fogOfWarEnabled}
						gameState={this.state.gameState}
						hoveredTile={this.state.hoveredTile}
						selectedTile={this.state.selectedTile}
						hoveredMoves={this.state.hoveredMoves}
						selectedMoves={this.state.selectedMoves}
						teamInfo={this.state.teamInfo}
						changeHovered={this.changeHovered}
						removeHovered={this.removeHovered}
						changeSelected={this.changeSelected}
					/>
				)
			case GameStatus.AwaitP1:
				return <AwaitPlayerScreen onResume={this.resumeGame} player={Team.A}/>
			case GameStatus.AwaitP2:
				return <AwaitPlayerScreen onResume={this.resumeGame} player={Team.B} />
			case GameStatus.Paused:
				return <PausedScreen />
			default:
				return null
		}
	}

	resumeGame = (): void => this.setState({ gameStatus: GameStatus.Game })

	render() {
		return (
			<SUI.Container style={{marginTop: '2em'}}>
				<SUI.Grid columns={2} divided doubling container>

					<SUI.Grid.Column width={12}>
						<SUI.Header as="h1" style={{ textAlign: 'center' }}>Shadow Chess</SUI.Header>
						<div style={{ width: 600, margin: 'auto' }}>
							{this.displayScreen()}
						</div>
					</SUI.Grid.Column>

					<SUI.Grid.Column width={4}>
						<SUI.Button onClick={this.toggleFogOfWar}>Toggle Fog of War</SUI.Button>
						<SUI.Header as="h3">Turn: {this.state.gameState.playerTurn}</SUI.Header>
						{this.state.gameState.inCheck &&
							<SUI.Header as="h3">Checked!</SUI.Header>
						}
					</SUI.Grid.Column>

				</SUI.Grid>
			</SUI.Container>
		)
	}
}
