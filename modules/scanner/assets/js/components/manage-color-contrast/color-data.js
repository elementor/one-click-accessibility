import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { UnstableColorIndicator } from '@elementor/ui/unstable';
import PropTypes from 'prop-types';
import { SunIcon } from '@ea11y-apps/scanner/images';
import { hexToHsl } from '@ea11y-apps/scanner/utils/convert-colors';

export const ColorData = ({ title, color }) => {
	const hslColor = hexToHsl(color);
	return (
		<Box display="flex" gap={2} alignItems="center" sx={{ p: 0.5 }}>
			<Typography variant="body2" sx={{ flexGrow: 1 }}>
				{title}
			</Typography>
			<Box display="flex" gap={1}>
				<SunIcon />
				<Box sx={{ width: '25px' }}>{hslColor.l}</Box>
				<Box>%</Box>
			</Box>
			<UnstableColorIndicator value={color} size="tiny" />
		</Box>
	);
};

ColorData.propTypes = {
	title: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
};
