import * as React from 'react'
import * as SUI from 'semantic-ui-react'
import EmptyChessGrid from './EmptyChessGrid'
import { Team } from '../constants'

interface IAwaitPlayerScreenProps {
	onResume: () => void
	player: Team
}

const AwaitPlayerScreen: React.SFC<IAwaitPlayerScreenProps> = props => (
	<SUI.Dimmer.Dimmable dimmed>
		<SUI.Dimmer active onClickOutside={props.onResume}>
			<SUI.Header as="h2" icon inverted style={{marginTop: 80}}>
				<SUI.Icon name="heart" />
				{props.player}'s Turn
			</SUI.Header>
		</SUI.Dimmer>
		<EmptyChessGrid />
	</SUI.Dimmer.Dimmable>
)
export default AwaitPlayerScreen