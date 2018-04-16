import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ChessContainer from './ChessContainer/ChessContainer'
import registerServiceWorker from './registerServiceWorker'
import 'semantic-ui-css/semantic.min.css'
import './index.css'

ReactDOM.render(
	<ChessContainer />,
	document.getElementById('root') as HTMLElement
)
registerServiceWorker()
