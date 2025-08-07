import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import PieChartLoader from '@ea11y/pages/assistant/loaders/pie-chart-loader';
import ValueLoader from '@ea11y/pages/assistant/loaders/value-loader';
import AccessibilityAssistantStatsIssueResovledBYCategory from '@ea11y/pages/assistant/stats/issue-by-category';
import AccessibilityAssistantStatsIssueLevels from '@ea11y/pages/assistant/stats/issue-levels';
import StatsPieChart from '@ea11y/pages/assistant/stats/pie-chart';
import AccessibilityAssistantTooltip from '@ea11y/pages/assistant/tooltip';
import { __ } from '@wordpress/i18n';
import CategoryPieChart from './category-pie-chart';

const AccessibilityAssistantStats = ({ stats, loading, noResultsState }) => {
	const levelsTotal =
		stats.issue_levels.a + stats.issue_levels.aa + stats.issue_levels.aaa;

	const firstLevelPercentage = stats.issue_levels.a
		? Math.round((stats.issue_levels.a / levelsTotal) * 100)
		: 0;

	const secondLevelPercentage = stats.issue_levels.aa
		? Math.round((stats.issue_levels.aa / levelsTotal) * 100)
		: 0;

	const openIssues = stats.issues_total - stats.issues_fixed;

	return (
		<StyledStatsContainer>
			<StyledStatsItem className="scanned-urls">
				<StyledStatsItemContent>
					<StyledStatsItemTitle variant="subtitle1" as="p">
						{__('Scanned URLs', 'pojo-accessibility')}

						<AccessibilityAssistantTooltip
							content={__(
								"View how many URLs you've already scanned for accessibility issues. A URL can be any page on your site, like a blog post or product page.",
								'pojo-accessibility',
							)}
						/>
					</StyledStatsItemTitle>

					<Typography variant="h4" as="p">
						{loading ? <ValueLoader /> : stats.scans}
					</Typography>
				</StyledStatsItemContent>
			</StyledStatsItem>

			<StyledStatsItem className="open-issues">
				<StyledStatsItemContent>
					<StyledStatsItemTitle variant="subtitle1" as="p">
						{__('Open Issues', 'pojo-accessibility')}

						<AccessibilityAssistantTooltip
							content={__(
								"View the number of accessibility issues that still need to be resolved. These are issues found during your latest scans that haven't been fixed yet.",
								'pojo-accessibility',
							)}
						/>
					</StyledStatsItemTitle>

					<Typography variant="h4" as="p">
						{loading ? <ValueLoader /> : openIssues}
					</Typography>
				</StyledStatsItemContent>
			</StyledStatsItem>

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
						<AccessibilityAssistantStatsIssueLevels
							issueLevels={stats.issue_levels}
						/>
					)}
				</StyledStatsItemContent>

				<StyledStatsItemChart>
					{loading ? (
						<PieChartLoader />
					) : (
						<StatsPieChart
							value={levelsTotal.toString()}
							firstSectorPercentage={firstLevelPercentage}
							secondSectorPercentage={secondLevelPercentage}
							noResultsState={noResultsState}
						/>
					)}
				</StyledStatsItemChart>
			</StyledStatsItem>

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
						<AccessibilityAssistantStatsIssueResovledBYCategory
							issueByCategory={stats.issue_by_category}
						/>
					)}
				</StyledStatsItemContent>

				<StyledStatsItemChart>
					<CategoryPieChart
						loading={loading}
						issueByCategory={stats.issue_by_category}
					/>
				</StyledStatsItemChart>
			</StyledStatsItem>
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
	grid-template-rows: 104px 176px;
	grid-column-gap: ${({ theme }) => theme.spacing(2)};
	grid-row-gap: ${({ theme }) => theme.spacing(2)};

	@media screen and (max-width: 960px) {
		grid-template-columns: 1fr;
		grid-template-rows: repeat(4, 1fr);
	}
`;

const StyledStatsItem = styled(Box)`
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding: ${({ theme }) => `${theme.spacing(2)} ${theme.spacing(2.5)}`};

	border-radius: ${({ theme }) => theme.shape.borderRadius * 2}px;
	background: ${({ theme }) => theme.palette.background.default};

	:nth-of-type(1) {
		grid-area: 1 / 1 / 2 / 2;
	}

	:nth-of-type(2) {
		grid-area: 1 / 2 / 2 / 3;
	}

	:nth-of-type(3) {
		grid-area: 2 / 1 / 3 / 3;
	}

	:nth-of-type(4) {
		grid-area: 1 / 3 / 3 / 4;
	}

	@media screen and (max-width: 960px) {
		:nth-of-type(1) {
			grid-area: 1 / 1 / 2 / 2;
		}

		:nth-of-type(2) {
			grid-area: 2 / 1 / 3 / 2;
		}

		:nth-of-type(3) {
			grid-area: 3 / 1 / 4 / 2;
		}

		:nth-of-type(4) {
			grid-area: 4 / 1 / 5 / 2;
		}
	}
`;

const StyledStatsItemContent = styled(Box)`
	min-width: 150px;
	min-height: 50px;
	height: 100%;
`;

const StyledStatsItemChart = styled(Box)`
	margin-inline-start: ${({ theme }) => theme.spacing(2)};

	@media screen and (max-width: 1200px) {
		& {
			display: none;
		}
	}
`;

const StyledStatsItemTitle = styled(Typography)`
	display: flex;
	justify-content: flex-start;
	align-items: center;

	margin: 0;
	margin-bottom: ${({ spacing, theme }) => theme.spacing(spacing || 2)};

	color: ${({ theme }) => theme.palette.text.primary};
	font-feature-settings:
		'liga' off,
		'clig' off;
	font-size: 16px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.15px;

	& svg {
		margin-inline-start: ${({ theme }) => theme.spacing(1)};
	}
`;

export default AccessibilityAssistantStats;
