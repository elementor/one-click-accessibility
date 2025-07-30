import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled, useTheme } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

const StatsPieChart = ({
	value,
	firstSectorPercentage,
	secondSectorPercentage,
	noResultsState,
}) => {
	const theme = useTheme();

	if (noResultsState) {
		return (
			<StyledProgressCircle
				background={`
					radial-gradient(closest-side, white 77%, transparent 78% 100%),
					conic-gradient(#10b981 0%, #f3f3f4 0)
				`}
			>
				<StyledEmptyStateValue variant="h4" as="span">
					0
					<StyledEmptyStateLabel variant="body2" as="span">
						{__('Issues', 'pojo-accessibility')}
					</StyledEmptyStateLabel>
				</StyledEmptyStateValue>
			</StyledProgressCircle>
		);
	}

	if (typeof value !== 'string') {
		let sectorColor = theme.palette.success.light;

		if (firstSectorPercentage <= 25) {
			sectorColor = theme.palette.error.main;
		}

		if (firstSectorPercentage > 25 && firstSectorPercentage <= 60) {
			sectorColor = theme.palette.warning.light;
		}

		const background = `
			radial-gradient(closest-side, white 77%, transparent 78% 100%),
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
			background={`radial-gradient(closest-side, white 77%, transparent 78% 100%), conic-gradient(
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
	noResultsState: PropTypes.bool,
};

const StyledProgressCircle = styled(Box)`
	width: 104px;
	height: 104px;
	display: flex;

	justify-content: center;
	align-items: center;
	border-radius: 100%;
	margin-right: ${({ theme }) => theme.spacing(0.5)};

	background: ${({ background }) => background};
`;

const StyledEmptyStateValue = styled(Typography)`
	display: flex;
	flex-direction: column;
	align-items: center;

	color: ${({ theme }) => theme.palette.text.secondary};
	font-feature-settings:
		'liga' off,
		'clig' off;
	font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
	font-size: 32px;
	font-weight: 700;
	line-height: 78%;
	letter-spacing: 0.25px;
`;

const StyledEmptyStateLabel = styled(Typography)`
	color: ${({ theme }) => theme.palette.text.tertiary};
	font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
	font-size: 14px;
	font-weight: 400;
	line-height: 143%;
	letter-spacing: 0.17px;
`;

export default StatsPieChart;
