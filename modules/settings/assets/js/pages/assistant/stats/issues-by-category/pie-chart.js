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
import {
	PieChart as MuiPieChart,
	pieArcLabelClasses,
} from '@mui/x-charts/PieChart';
import PropTypes from 'prop-types';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
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
			return [{ label: 'Loading...', value: 100, color: '#f3f3f4' }];
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
