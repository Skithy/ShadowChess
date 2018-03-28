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
			: props.hoveredMove
				? 'lightblue'
				: props.selectedMove
					? 'red'
					: props.ghost
						? 'black'
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
	flex: 0 0 12.5%;
	display: flex;
	align-items: center;
	justify-content: center;
	:after {
		content: '';
		display: block;
		padding-top: 100%;
	}
`
export default ChessTile