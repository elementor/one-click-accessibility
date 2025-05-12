import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';

const CustomIcon = ({ size }) => {
	const { iconDesign } = useSettings();
	const strokeColor = `lch(from ${iconDesign?.color || '#fff'} calc((50 - l) * 100) 0 0)`;

	return (
		<StyledDiv
			className="custom-icon"
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			dangerouslySetInnerHTML={{ __html: iconDesign?.custom?.svg }}
			size={size}
			strokeColor={strokeColor}
		/>
	);
};

export default CustomIcon;

const StyledDiv = styled('div')`
	svg {
		font-size: ${({ size }) => size}px;
		width: ${({ size }) => size}px;
		fill: ${({ strokeColor }) => strokeColor};

		path {
			fill: ${({ strokeColor }) => strokeColor};
		}
	}
`;
