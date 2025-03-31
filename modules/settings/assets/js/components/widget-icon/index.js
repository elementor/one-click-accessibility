import Box from '@elementor/ui/Box';
import { useSettings } from '@ea11y/hooks';
import { cloneElement } from '@wordpress/element';

const WidgetIcon = ({ icon, size, radius, control, type }) => {
	const { iconDesign } = useSettings();
	const strokeColor = `lch(from ${iconDesign?.color || '#fff'} calc((50 - l) * 100) 0 0)`;
	let cornerRadius =
		radius || iconDesign?.cornerRadius?.radius + iconDesign?.cornerRadius?.unit;

	if (control === 'select' && type === 'text') {
		cornerRadius = 1;
	}

	if (control === 'size' && type === 'text') {
		console.log(size);
	}

	return (
		<Box
			sx={{
				backgroundColor: iconDesign?.color,
				padding: 2,
				borderRadius: cornerRadius,
				width: 'text' === type ? size * 2 : size,
				height: size,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					border: 2,
					borderColor: strokeColor,
					borderRadius: cornerRadius,
					padding: 1,
					width: 'text' === type ? size * 2 - 10 : size - 10,
					height: size - 10,
					display: 'inline-flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{cloneElement(icon, { size: size / 2 })}
			</Box>
		</Box>
	);
};

export default WidgetIcon;
