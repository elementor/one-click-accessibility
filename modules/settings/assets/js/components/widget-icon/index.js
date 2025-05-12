import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import { CustomIcon } from '@ea11y/components';
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
	let innerBoxHeight = size;
	let innerBoxWidth = size;

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

	// Calculate inner size separately
	if (size === 64) {
		innerBoxWidth = size - 16;
		innerBoxHeight = size - 16;
		if (type === 'text') {
			innerBoxWidth = size * 1.9 - 16;
			innerBoxHeight = size - 16;
		}
	} else if (size === 44) {
		innerBoxWidth = size - 14;
		innerBoxHeight = size - 14;
		if (type === 'text') {
			innerBoxWidth = size * 1.9 - 14;
			innerBoxHeight = size - 14;
		}
	} else {
		innerBoxWidth = size - 12;
		innerBoxHeight = size - 12;
		if (type === 'text') {
			innerBoxWidth = size * 1.9 - 12;
			innerBoxHeight = size - 12;
		}
	}

	return (
		<StyledIconWrapper
			sx={{
				backgroundColor: iconDesign?.color,
				borderRadius: cornerRadius,
				width: 'text' === type ? size * 1.9 : size,
				height: size,
			}}
		>
			<StyledIconInnerWrapper
				sx={{
					border: borderWidth,
					borderColor: strokeColor,
					borderRadius: innerRadius,
					padding: size >= 50 ? '12px' : 1,
					width: innerBoxWidth,
					height: innerBoxHeight,
				}}
			>
				{type !== 'custom' && cloneElement(icon, { size: iconSize / 2.5 })}
				{type === 'custom' && <CustomIcon size={iconSize / 2.5} />}
			</StyledIconInnerWrapper>
		</StyledIconWrapper>
	);
};

export default WidgetIcon;

const StyledIconWrapper = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${({ theme }) => theme.spacing(1)};
`;

const StyledIconInnerWrapper = styled(Box)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
`;
