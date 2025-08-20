import {
	ColorBlue100,
	ColorBlue200,
	ColorBlue300,
	ColorBlue400,
	ColorBlue500,
	ColorBlue700,
	ColorBlue900,
} from '@elementor/design-tokens/primitives';
import Box from '@elementor/ui/Box';
import Paper from '@elementor/ui/Paper';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	PieChart as MuiPieChart,
	pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import PropTypes from 'prop-types';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
import { __ } from '@wordpress/i18n';

// Tooltip component for the pie chart
const CategoryPieTooltip = (props) => {
	const { itemData, series } = props;
	const data = series.data[itemData.dataIndex];
	return (
		<Paper sx={{ p: 2, pb: 1 }}>
			<StyledTooltipTitle
				variant="body2"
				color="text.tertiary"
				itemColor={data.color}
			>
				{data.categoryTitle}
			</StyledTooltipTitle>
			<Typography variant="h6">
				{`${data.categoryCount} (${data.value}%)`}
			</Typography>
		</Paper>
	);
};

const StyledTooltipTitle = styled(Typography)`
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

const CategoryPieChart = ({ issueByCategory, loading }) => {
	// Loading state
	if (loading) {
		const loadingBackground = `
			radial-gradient(closest-side, white 84%, transparent 85% 100%),
			conic-gradient(#e5e7eb 0%, #f3f3f4 50%, #e5e7eb 100%)
		`;
		return <StyledLoadingPieChart background={loadingBackground} />;
	}

	// Process categories similar to issue-by-category.js
	const processedCategories = () => {
		// Convert to array and sort by count (descending)
		const sortedCategories = Object.entries(issueByCategory || {})
			.map(([key, count]) => ({
				key,
				title: BLOCK_TITLES[key] || key,
				count: count || 0,
			}))
			.sort((a, b) => b.count - a.count);

		// Calculate total issues across all categories
		const totalIssues = sortedCategories.reduce(
			(sum, category) => sum + category.count,
			0,
		);

		// Take top 6 categories
		const top6 = sortedCategories.slice(0, 6);
		// Calculate "other" count from remaining categories
		const otherCount = sortedCategories
			.slice(6)
			.reduce((sum, category) => sum + category.count, 0);

		// Add "other" category if there are remaining categories or if it has count
		const result = [...top6];
		if (otherCount > 0 || sortedCategories.length > 6) {
			result.push({
				key: 'other',
				title: __('Other', 'pojo-accessibility'),
				count: otherCount,
			});
		}

		// Convert to MUI PieChart format with percentages and colors
		return result.map((category, index) => {
			const percentage =
				totalIssues > 0
					? parseFloat(((category.count / totalIssues) * 100).toFixed(2))
					: 0;
			const color =
				[
					ColorBlue900,
					ColorBlue700,
					ColorBlue500,
					ColorBlue400,
					ColorBlue300,
					ColorBlue200,
					ColorBlue100, // for "other"
				][index] || ColorBlue100;

			return {
				label: `${category.title}: ${percentage}%`,
				value: percentage,
				color,
				categoryTitle: category.title,
				categoryCount: category.count,
			};
		});
	};

	const categories = processedCategories();

	// Show chart if we have data
	const showChart = categories.length > 0 && !loading;

	return (
		<Box
			sx={{
				width: 200,
				height: 200,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginRight: 1.5,
			}}
		>
			{showChart && (
				<MuiPieChart
					series={[
						{
							data: categories,
							innerRadius: 66,
							outerRadius: 80,
							paddingAngle: 0,
							cornerRadius: 0,
							startAngle: 0,
							endAngle: 360,
							cx: 100,
							cy: 100,
						},
					]}
					slots={{
						itemContent: CategoryPieTooltip,
					}}
					width={200}
					height={200}
					slotProps={{
						legend: { hidden: true }, // Hide legend to match original design
					}}
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						[`& .${pieArcLabelClasses.root}`]: {
							display: 'none', // Hide arc labels to match original design
						},
					}}
				/>
			)}
			{loading && <StyledLoadingPieChart />}
		</Box>
	);
};

CategoryPieChart.propTypes = {
	issueByCategory: PropTypes.shape({
		altText: PropTypes.number,
		dynamicContent: PropTypes.number,
		formsInputsError: PropTypes.number,
		keyboardAssistiveTech: PropTypes.number,
		pageStructureNav: PropTypes.number,
		tables: PropTypes.number,
		colorContrast: PropTypes.number,
		other: PropTypes.number,
	}),
	loading: PropTypes.bool.isRequired,
};

// Keep the loading component as is
const StyledLoadingPieChart = styled(Box)`
	width: 200px;
	height: 200px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
	background:
		radial-gradient(closest-side, white 84%, transparent 85% 100%),
		conic-gradient(#e5e7eb 0%, #f3f3f4 50%, #e5e7eb 100%);
	animation: rotate 3s linear infinite;

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
`;

export default CategoryPieChart;
