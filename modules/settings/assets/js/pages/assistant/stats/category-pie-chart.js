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
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
import { __ } from '@wordpress/i18n';

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

		// Convert counts to percentages and add colors
		return result.map((category, index) => ({
			key: category.key,
			percentage:
				totalIssues > 0 ? Math.round((category.count / totalIssues) * 100) : 0,
			color:
				[
					ColorBlue900,
					ColorBlue700,
					ColorBlue500,
					ColorBlue400,
					ColorBlue300,
					ColorBlue200,
					ColorBlue100, // for "other"
				][index] || ColorBlue100,
		}));
	};

	const categories = processedCategories();

	// Create conic-gradient string
	const createConicGradient = () => {
		if (categories.length === 0) {
			return 'conic-gradient(#f3f3f4 0%, #f3f3f4 100%)';
		}

		let cumulativePercentage = 0;
		const gradientStops = [];

		categories.forEach((category) => {
			const startPercentage = cumulativePercentage;
			const endPercentage = cumulativePercentage + category.percentage;

			gradientStops.push(
				`${category.color} ${startPercentage}% ${endPercentage}%`,
			);
			cumulativePercentage += category.percentage;
		});

		// Fill remaining space with light gray if total is less than 100%
		if (cumulativePercentage < 100) {
			gradientStops.push(`#f3f3f4 ${cumulativePercentage}% 100%`);
		}

		return `conic-gradient(${gradientStops.join(', ')})`;
	};

	const background = `
		radial-gradient(closest-side, white 84%, transparent 85% 100%),
		${createConicGradient()}
	`;

	return <StyledCategoryPieChart background={background} />;
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

const StyledCategoryPieChart = styled(Box)`
	width: 176px;
	height: 176px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
	background: ${({ background }) => background};
	margin-right: ${({ theme }) => theme.spacing(1.5)};
`;

const StyledLoadingPieChart = styled(Box)`
	width: 176px;
	height: 176px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 100%;
	background: ${({ background }) => background};
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
