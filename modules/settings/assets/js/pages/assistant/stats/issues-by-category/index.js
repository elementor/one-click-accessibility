import ValueLoader from '@ea11y/pages/assistant/loaders/value-loader';
import AccessibilityAssistantTooltip from '@ea11y/pages/assistant/tooltip';
import { __ } from '@wordpress/i18n';
import {
	StyledStatsItem,
	StyledStatsItemContent,
	StyledStatsItemChart,
	StyledStatsItemTitle,
} from '../stats.styles';
import IssueList from './issue-list';
import PieChart from './pie-chart';

const IssuesByCategory = ({ stats, loading, noResultsState }) => {
	return (
		<StyledStatsItem className="resolved-issues-by-category">
			<StyledStatsItemContent>
				<StyledStatsItemTitle variant="subtitle1" as="p" spacing={3}>
					{__('Resolved issues by category', 'pojo-accessibility')}

					<AccessibilityAssistantTooltip
						content={__(
							"Track how many accessibility issues you've resolved in each category.",
							'pojo-accessibility',
						)}
					/>
				</StyledStatsItemTitle>

				{loading ? (
					<ValueLoader />
				) : (
					<IssueList issueByCategory={stats.issue_by_category} />
				)}
			</StyledStatsItemContent>

			<StyledStatsItemChart>
				<PieChart
					loading={loading}
					issueByCategory={stats.issue_by_category}
					noResultsState={noResultsState}
				/>
			</StyledStatsItemChart>
		</StyledStatsItem>
	);
};

export default IssuesByCategory;
