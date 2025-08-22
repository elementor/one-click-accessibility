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
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { BLOCK_TITLES } from '@ea11y-apps/scanner/constants';
import { __ } from '@wordpress/i18n';

// Override titles for specific category keys
const CATEGORY_TITLE_OVERRIDES = {
	keyboardAssistiveTech: __('Keyboard/Assistive', 'pojo-accessibility'),
	dynamicContent: __('Dynamic/Aria', 'pojo-accessibility'),
};

const IssueList = ({ issueByCategory }) => {
	// Process categories to show top 6 by usage + "other"
	const processedCategories = () => {
		// Convert to array and sort by count (descending)
		const sortedCategories = Object.entries(issueByCategory || {})
			.map(([key, count]) => ({
				key,
				title: CATEGORY_TITLE_OVERRIDES[key] || BLOCK_TITLES[key] || key,
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

		// Convert counts to percentages
		return result.map((category) => ({
			...category,
			percentage:
				totalIssues > 0 ? Math.round((category.count / totalIssues) * 100) : 0,
		}));
	};

	const categories = processedCategories();

	return (
		<>
			{categories.map(({ key, title, percentage }, index) => (
				<StyledIssueLevel key={key} colorIndex={index}>
					<Typography variant="body2">{title}</Typography>

					<StyledIssuesCount variant="subtitle2" as="p">
						{percentage === 0 ? '-' : `${percentage}%`}
					</StyledIssuesCount>
				</StyledIssueLevel>
			))}
		</>
	);
};

IssueList.propTypes = {
	issueByCategory: PropTypes.object.isRequired,
};

const StyledIssueLevel = styled(Box)`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1)};

	margin-inline-start: ${({ theme }) => theme.spacing(0.5)};

	&:not(:last-of-type) {
		margin-bottom: ${({ theme }) => theme.spacing(1)};
	}

	&::before {
		content: '';
		width: 10px;
		height: 10px;
		margin-inline-end: ${({ theme }) => theme.spacing(1)};
		border-radius: 100%;
		background-color: ${({ colorIndex }) => {
			const colors = [
				ColorBlue900,
				ColorBlue700,
				ColorBlue500,
				ColorBlue400,
				ColorBlue300,
				ColorBlue200,
				ColorBlue100, // (for "other")
			];
			return colors[colorIndex % colors.length];
		}};
	}
`;

const StyledIssuesCount = styled(Typography)`
	margin: 0;
	margin-inline-start: auto;

	color: ${({ theme }) => theme.palette.text.primary};
	font-size: 14px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.1px;
	min-width: 50px;
	text-align: left;
`;

export default IssueList;
