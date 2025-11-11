import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { UnstableColorIndicator } from '@elementor/ui/unstable';
import PropTypes from 'prop-types';
import { SunIcon } from '@ea11y-apps/scanner/images';
import { hexToHsl } from '@ea11y-apps/scanner/utils/convert-colors';

export const ColorData = ({ title, color, isActive }) => {
	const hslColor = hexToHsl(color);
	return (
		<Box display="flex" gap={2} alignItems="center" sx={{ p: 0.5 }}>
			<Typography variant="body2" sx={{ flexGrow: 1 }}>
				{title}
			</Typography>
			<StyledBox display="flex" gap={1} isActive={isActive}>
				<SunIcon />
				<Box sx={{ width: '25px' }}>{hslColor.l}</Box>
				<Box>%</Box>
			</StyledBox>
			<UnstableColorIndicator value={color} size="tiny" />
		</Box>
	);
};

const StyledBox = styled(Box)`
	color: ${({ isActive, theme }) =>
		isActive ? theme.palette.text.primary : theme.palette.text.disabled};

	& svg * {
		stroke: ${({ isActive, theme }) =>
			isActive
				? theme.palette.text.primary
				: theme.palette.text.disabled}!important;
	}
`;

ColorData.propTypes = {
	title: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	isActive: PropTypes.bool.isRequired,
};
