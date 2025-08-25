import {
	ColorGreen900,
	ColorGreen500,
	ColorGreen200,
} from '@elementor/design-tokens/primitives';
import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import {
	PieChart as MuiPieChart,
	pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import PropTypes from 'prop-types';
import StatsPieTooltip from '../tooltip';

const PieChart = ({
	loading,
	value,
	firstSectorPercentage,
	secondSectorPercentage,
	thirdSectorPercentage,
	noResultsState,
}) => {
	const hasNoData =
		firstSectorPercentage === 0 &&
		secondSectorPercentage === 0 &&
		thirdSectorPercentage === 0;

	let pieData = [
		{ label: 'A', value: firstSectorPercentage, color: ColorGreen900 },
		{ label: 'AA', value: secondSectorPercentage, color: ColorGreen500 },
		{ label: 'AAA', value: thirdSectorPercentage, color: ColorGreen200 },
	];

	if (loading || noResultsState || hasNoData) {
		pieData = [{ label: 'No Issues', value: 100, color: '#f3f3f4' }];
	}

	return (
		<Box
			sx={{
				width: 120,
				height: 120,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginRight: 0.5,
				position: 'relative',
			}}
		>
			<MuiPieChart
				series={[
					{
						data: pieData,
						innerRadius: 40,
						outerRadius: 52,
						cx: 60,
						cy: 60,
					},
				]}
				slots={{
					itemContent: StatsPieTooltip,
				}}
				width={120}
				height={120}
				slotProps={{
					legend: { hidden: true },
				}}
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					[`& .${pieArcLabelClasses.root}`]: {
						display: 'none',
					},
				}}
			/>
			<Box
				sx={{
					position: 'absolute',
					top: '55%',
					left: '53%',
					transform: 'translate(-50%, -50%)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography variant="h4" as="span">
					{value}
				</Typography>
			</Box>
		</Box>
	);
};

PieChart.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	firstSectorPercentage: PropTypes.number.isRequired,
	secondSectorPercentage: PropTypes.number,
	thirdSectorPercentage: PropTypes.number,
	noResultsState: PropTypes.bool,
};

export default PieChart;
