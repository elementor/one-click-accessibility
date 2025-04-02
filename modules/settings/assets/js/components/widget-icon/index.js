import Box from '@elementor/ui/Box';
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
		<Box
			sx={{
				backgroundColor: iconDesign?.color,
				padding: 1,
				borderRadius: cornerRadius,
				width: 'text' === type ? size * 1.9 : size,
				height: size,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					border: borderWidth,
					borderColor: strokeColor,
					borderRadius: innerRadius,
					padding: size >= 50 ? '12px' : 1,
					width: 'text' === type ? size * 1.9 - 10 : size - 10,
					height: size - 10,
					display: 'inline-flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{cloneElement(icon, { size: iconSize / 2.5 })}
			</Box>
		</Box>
	);
};

export default WidgetIcon;
