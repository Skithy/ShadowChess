import styled from 'styled-components'

interface IChessTileProps {
	ghost?: boolean
	hovered?: boolean
	selected?: boolean
	hoveredMove?: boolean
	selectedMove?: boolean
	fogOfWar?: boolean
	dark?: boolean
}

const getTileHover = (props: IChessTileProps): string => {
	const borderColour = props.selected
		? 'magenta'
		: props.hovered
			? 'gold'
			: props.ghost
				? 'black'
				: props.hoveredMove
					? 'lightblue'
					: props.selectedMove
						? 'red'
						: 'transparent'
	
	return borderColour ? `border: 4px solid ${borderColour};` : ''
}

const getTileColour = (props: IChessTileProps): string => {
	const { fogOfWar, dark } = props
	const backgroundColour = fogOfWar
		? dark ? '#5F6A6A' : '#717D7E'
		: dark ? '#935116' : '#F5B041'
	return `background-color: ${backgroundColour};`
}

const ChessTile = styled.div`
	${getTileColour}
	${getTileHover}
	width: 5em;
	height: 5em;
	display: flex;
	align-items: center;
	justify-content: center;
`
export default ChessTile