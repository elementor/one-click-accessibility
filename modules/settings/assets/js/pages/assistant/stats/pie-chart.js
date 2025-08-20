import Box from '@elementor/ui/Box';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled, useTheme } from '@elementor/ui/styles';
import {
	PieChart as MuiPieChart,
	pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

// Tooltip component for the pie chart
const StatsPieTooltip = (props) => {
	const { itemData, series } = props;
	const data = series.data[itemData.dataIndex];
	return (
		<Paper sx={{ p: 2, pb: 1 }}>
			<StyledStatsPieTooltipTitle
				variant="body2"
				color="text.tertiary"
				itemColor={data.color}
			>
				{data.label}
			</StyledStatsPieTooltipTitle>
			<Typography variant="h6">{`${data.value}%`}</Typography>
		</Paper>
	);
};

const StyledStatsPieTooltipTitle = styled(Typography)`
	position: relative;
	padding-left: 18px;
	&:before {
		content: '';
		position: absolute;
		left: 0;
		top: calc(50% - 5px);
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: ${(props) => props.itemColor};
	}
`;

const StatsPieChart = ({
	value,
	firstSectorPercentage,
	secondSectorPercentage,
	noResultsState,
}) => {
	const theme = useTheme();

	// Helper function to create pie chart data
	const createPieData = () => {
		if (noResultsState) {
			return [{ label: 'No Issues', value: 100, color: '#f3f3f4' }];
		}

		if (typeof value !== 'string') {
			// Single sector chart
			let sectorColor = theme.palette.success.light;

			if (firstSectorPercentage <= 25) {
				sectorColor = theme.palette.error.main;
			}

			if (firstSectorPercentage > 25 && firstSectorPercentage <= 60) {
				sectorColor = theme.palette.warning.light;
			}

			const remainingPercentage = 100 - firstSectorPercentage;
			return [
				{ label: 'Progress', value: firstSectorPercentage, color: sectorColor },
				...(remainingPercentage > 0
					? [
							{
								label: 'Remaining',
								value: remainingPercentage,
								color: '#f3f3f4',
							},
						]
					: []),
			];
		}

		// Multi-sector chart
		const thirdSectorPercentage =
			100 - firstSectorPercentage - (secondSectorPercentage || 0);
		return [
			{ label: 'A', value: firstSectorPercentage, color: '#064E3B' },
			...(secondSectorPercentage > 0
				? [
						{
							label: 'AA',
							value: secondSectorPercentage,
							color: '#10b981',
						},
					]
				: []),
			...(thirdSectorPercentage > 0
				? [{ label: 'AAA', value: thirdSectorPercentage, color: '#a7f3d0' }]
				: []),
		];
	};

	const pieData = createPieData();
	const showChart = pieData.length > 0;

	// No results state with center text
	if (noResultsState) {
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
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<StyledEmptyStateValue variant="h4" as="span">
						0
						<StyledEmptyStateLabel variant="body2" as="span">
							{__('Issues', 'pojo-accessibility')}
						</StyledEmptyStateLabel>
					</StyledEmptyStateValue>
				</Box>
			</Box>
		);
	}

	// Regular chart with center value
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
			{showChart && (
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
			)}
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

StatsPieChart.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	firstSectorPercentage: PropTypes.number.isRequired,
	secondSectorPercentage: PropTypes.number,
	thirdSectorPercentage: PropTypes.number,
	noResultsState: PropTypes.bool,
};

// Remove the old styled component as we're now using MUI PieChart

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
