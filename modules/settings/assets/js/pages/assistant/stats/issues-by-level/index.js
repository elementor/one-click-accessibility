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

const IssuesByLevel = ({ stats, loading, noResultsState }) => {
	const levelsTotal =
		stats.issue_levels.a + stats.issue_levels.aa + stats.issue_levels.aaa;

	const firstLevelPercentage = stats.issue_levels.a
		? Math.round((stats.issue_levels.a / levelsTotal) * 100)
		: 0;

	const secondLevelPercentage = stats.issue_levels.aa
		? Math.round((stats.issue_levels.aa / levelsTotal) * 100)
		: 0;

	const thirdLevelPercentage = stats.issue_levels.aaa
		? Math.round((stats.issue_levels.aaa / levelsTotal) * 100)
		: 0;

	return (
		<StyledStatsItem className="resolved-issues-by-level">
			<StyledStatsItemContent>
				<StyledStatsItemTitle variant="subtitle1" as="p" spacing={3}>
					{__('Resolved issues by level', 'pojo-accessibility')}

					<AccessibilityAssistantTooltip
						content={__(
							"Track how many issues you've resolved for each WCAG level. Meeting these guidelines helps make your site more accessible and inclusive for all visitors.",
							'pojo-accessibility',
						)}
					/>
				</StyledStatsItemTitle>

				{loading ? (
					<ValueLoader />
				) : (
					<IssueList issueLevels={stats.issue_levels} />
				)}
			</StyledStatsItemContent>

			<StyledStatsItemChart>
				<PieChart
					loading={loading}
					value={levelsTotal.toString()}
					firstSectorPercentage={firstLevelPercentage}
					secondSectorPercentage={secondLevelPercentage}
					thirdSectorPercentage={thirdLevelPercentage}
					noResultsState={noResultsState}
				/>
			</StyledStatsItemChart>
		</StyledStatsItem>
	);
};

export default IssuesByLevel;
