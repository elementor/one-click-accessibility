import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import IssuesByCategory from '@ea11y/pages/assistant/stats/issues-by-category/';
import IssuesByLevel from '@ea11y/pages/assistant/stats/issues-by-level/';
import StatsCounter from '@ea11y/pages/assistant/stats/stats-counter/';
import { __ } from '@wordpress/i18n';

const AccessibilityAssistantStats = ({ stats, loading, noResultsState }) => {
	const openIssues = stats.issues_total - stats.issues_fixed;

	return (
		<StyledStatsContainer>
			<StatsCounter
				stat={stats.scans}
				loading={loading}
				title={__('Scanned URLs', 'pojo-accessibility')}
				tooltip={__(
					"View how many URLs you've already scanned for accessibility issues. A URL can be any page on your site, like a blog post or product page.",
					'pojo-accessibility',
				)}
			/>

			<StatsCounter
				stat={openIssues}
				loading={loading}
				title={__('Open Issues', 'pojo-accessibility')}
				tooltip={__(
					"View the number of accessibility issues that still need to be resolved. These are issues found during your latest scans that haven't been fixed yet.",
					'pojo-accessibility',
				)}
			/>

			<IssuesByLevel
				stats={stats}
				loading={loading}
				noResultsState={noResultsState}
			/>
			<IssuesByCategory
				stats={stats}
				loading={loading}
				noResultsState={noResultsState}
			/>
		</StyledStatsContainer>
	);
};

AccessibilityAssistantStats.propTypes = {
	stats: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	noResultsState: PropTypes.bool,
};

const StyledStatsContainer = styled(Box)`
	margin-top: ${({ theme }) => theme.spacing(3)};

	display: grid;
	grid-template-columns: 1fr 1fr 2fr;
	grid-template-rows: 104px 206px;
	grid-column-gap: ${({ theme }) => theme.spacing(2)};
	grid-row-gap: ${({ theme }) => theme.spacing(2)};

	@media screen and (max-width: 960px) {
		grid-template-columns: 1fr;
		grid-template-rows: repeat(4, 1fr);
	}
`;

export default AccessibilityAssistantStats;
