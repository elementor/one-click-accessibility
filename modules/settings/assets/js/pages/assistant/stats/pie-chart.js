import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';

const StatsPieChart = ({
	value,
	firstSectorPercentage,
	secondSectorPercentage,
}) => {
	const theme = useTheme();

	if (typeof value !== 'string') {
		let sectorColor = theme.palette.success.light;

		if (firstSectorPercentage <= 25) {
			sectorColor = theme.palette.error.main;
		}

		if (firstSectorPercentage > 25 && firstSectorPercentage <= 60) {
			sectorColor = theme.palette.warning.light;
		}

		const background = `
			radial-gradient(closest-side, white 79%, transparent 80% 100%),
			conic-gradient(${sectorColor} ${firstSectorPercentage}%, #f3f3f4 0)
		`;

		return (
			<StyledProgressCircle background={background}>
				{value}
			</StyledProgressCircle>
		);
	}

	return (
		<StyledProgressCircle
			as="div"
			background={`radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(
				#064E3B 0% ${firstSectorPercentage}%,
				#10b981 ${firstSectorPercentage}% ${firstSectorPercentage + secondSectorPercentage}%,
				#a7f3d0 ${firstSectorPercentage + secondSectorPercentage}% 100%
			)`}
		>
			<Typography variant="h4" as="span">
				{value}
			</Typography>
		</StyledProgressCircle>
	);
};

StatsPieChart.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	firstSectorPercentage: PropTypes.number.isRequired,
	secondSectorPercentage: PropTypes.number,
	thirdSectorPercentage: PropTypes.number,
};

const StyledProgressCircle = styled(Box)`
	width: 104px;
	height: 104px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
	background: ${({ background }) => background};
`;

export default StatsPieChart;
