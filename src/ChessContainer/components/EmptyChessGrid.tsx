import * as React from 'react'
import ChessTile from './ChessTile'

const EmptyChessGrid = (): JSX.Element => (
	<>
		{Array.from(new Array(8)).map((row, y) =>
			<div key={y} style={{ display: 'flex'}}>
				{Array.from(new Array(8)).map((tile, x) =>
					<ChessTile
						key={y * 8 + x}
						dark={(y + x) % 2 === 1}
					/>
				)}
			</div>
		)}
	</>
)
export default EmptyChessGrid