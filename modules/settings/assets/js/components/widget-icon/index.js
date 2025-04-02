import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import { cloneElement } from '@wordpress/element';

const WidgetIcon = ({ icon, size, radius, control, type }) => {
	const { iconDesign } = useSettings();
	const strokeColor = `lch(from ${iconDesign?.color || '#2563EB'} calc((50 - l) * 100) 0 0)`;
	let cornerRadius =
		radius || iconDesign?.cornerRadius?.radius + iconDesign?.cornerRadius?.unit;
	let innerRadius =
		radius ||
		iconDesign?.cornerRadius?.radius - 3 + iconDesign?.cornerRadius?.unit;
	let iconSize = size;
	let borderWidth = 1;

	// Override values for text icon in select control
	if (control === 'select' && type === 'text') {
		cornerRadius = 1;
		innerRadius = 0.5;
	}

	// Calculate icon size separately for text
	if (control === 'size' && type === 'text') {
		if (size > 50) {
			iconSize = size * 1.2;
		} else {
			iconSize = size * 1;
		}
	}

	// Calculate border width
	if (size >= 64) {
		borderWidth = 2;
	} else if (size >= 44 && size < 64) {
		borderWidth = 1.5;
	} else {
		borderWidth = 1;
	}

	return (
		<IconWrapper
			sx={{
				backgroundColor: iconDesign?.color,
				borderRadius: cornerRadius,
				width: 'text' === type ? size * 1.9 : size,
				height: size,
			}}
		>
			<IconInnerWrapper
				sx={{
					border: borderWidth,
					borderColor: strokeColor,
					borderRadius: innerRadius,
					padding: size >= 50 ? '12px' : 1,
					width: 'text' === type ? size * 1.9 - 10 : size - 10,
					height: size - 10,
				}}
			>
				{cloneElement(icon, { size: iconSize / 2.5 })}
			</IconInnerWrapper>
		</IconWrapper>
	);
};

export default WidgetIcon;

const IconWrapper = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${({ theme }) => theme.spacing(1)};
`;

const IconInnerWrapper = styled(Box)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
`;
