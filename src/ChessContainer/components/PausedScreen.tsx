import * as React from 'react'
import * as SUI from 'semantic-ui-react'
import EmptyChessGrid from './EmptyChessGrid'

interface IPausedScreenProps {
}

const PausedScreen: React.SFC<IPausedScreenProps> = props => (
	<SUI.Dimmer.Dimmable dimmed>
		<SUI.Dimmer active>
			<SUI.Header as="h2" icon inverted style={{ marginTop: 80 }}>
				<SUI.Icon name="pause" />
				Player WIN
			</SUI.Header>
		</SUI.Dimmer>
		<EmptyChessGrid />
	</SUI.Dimmer.Dimmable>
)
export default PausedScreen