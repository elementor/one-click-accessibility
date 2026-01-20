import {
	ColorBlue500,
	ColorBlue700,
	ColorBurgundy900,
	ColorCyan400,
	ColorGreen500,
	ColorGreen700,
	ColorGrey50,
	ColorPink400,
} from '@elementor/design-tokens';
import Box from '@elementor/ui/Box';
import {
	pieArcLabelClasses,
	PieChart as MuiPieChart,
} from '@mui/x-charts/PieChart';
import PropTypes from 'prop-types';
import { BLOCK_TITLES } from '@ea11y-apps/global/constants';
import { __ } from '@wordpress/i18n';
import StatsPieTooltip from '../tooltip';

const PieChart = ({ issueByCategory, loading, noResultsState }) => {
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

		if (loading || totalIssues === 0 || noResultsState) {
			return [{ label: 'Loading...', value: 100, color: ColorGrey50 }];
		}

		// Convert to MUI PieChart format with percentages and colors
		return result.map((category, index) => {
			const percentage =
				totalIssues > 0
					? parseFloat(((category.count / totalIssues) * 100).toFixed(2))
					: 0;
			const color =
				[
					ColorBurgundy900,
					ColorPink400,
					ColorBlue700,
					ColorBlue500,
					ColorGreen700,
					ColorGreen500,
					ColorCyan400, // for "other"
				][index] || ColorCyan400;

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

	return (
		<Box
			sx={{
				width: 200,
				height: 200,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
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
					itemContent: StatsPieTooltip,
				}}
				width={200}
				height={200}
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
		</Box>
	);
};

PieChart.propTypes = {
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

export default PieChart;
