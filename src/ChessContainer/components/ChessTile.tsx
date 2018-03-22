import styled from 'styled-components'

interface IChessTileProps {
	fogOfWar?: boolean
	dark?: boolean
	hover?: boolean
	availableMove?: boolean
	selected?: boolean
}

const getTileHover = (props: IChessTileProps): string => {
	const borderColour = props.hover
		? 'gold'
		: props.availableMove || props.selected
			? 'lightblue'
			: ''
	
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
	width: 4em;
	height: 4em;
	display: flex;
	align-items: center;
	justify-content: center;
`
export default ChessTile