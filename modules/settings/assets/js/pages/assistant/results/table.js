import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import ChevronUpIcon from '@elementor/icons/ChevronUpIcon';
import HistoryIcon from '@elementor/icons/HistoryIcon';
import Box from '@elementor/ui/Box';
import LinearProgress from '@elementor/ui/LinearProgress';
import Table from '@elementor/ui/Table';
import TableBody from '@elementor/ui/TableBody';
import TableCell from '@elementor/ui/TableCell';
import TableContainer from '@elementor/ui/TableContainer';
import TableFooter from '@elementor/ui/TableFooter';
import TableHead from '@elementor/ui/TableHead';
import TableRow from '@elementor/ui/TableRow';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import Button from '@ea11y/components/button';
import VisuallyHidden from '@ea11y/components/visually-hidden';
import TableLoader from '@ea11y/pages/assistant/loaders/table-loader';
import AccessibilityAssistantResultsTableCTA from '@ea11y/pages/assistant/results/cta';
import AccessibilityAssistantResultsPagination from '@ea11y/pages/assistant/results/pagination';
import AccessibilityAssistantResultsTableProgressChip from '@ea11y/pages/assistant/results/progress-chip';
import AccessibilityAssistantTooltip from '@ea11y/pages/assistant/tooltip';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { dateI18n } from '@wordpress/date';
import { Fragment, useState, forwardRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const AccessibilityAssistantResultsTable = ({ scannerResults, loading }) => {
	const [openRows, setOpenRows] = useState({});

	const handleToggleRow = (index) => {
		const willBeOpen = !openRows[index];

		setOpenRows((prev) => ({
			...prev,
			[index]: willBeOpen,
		}));

		mixpanelService.sendEvent(
			mixpanelEvents.assistantDashboardHistoryLogsButtonClicked,
			{
				state: willBeOpen ? 'open' : 'closed',
			},
		);
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);

		return dateI18n(__('d.m.Y, H:i', 'pojo-accessibility'), date, undefined);
	};

	if (loading) {
		return (
			<StyledTableContainer>
				<TableLoader />
			</StyledTableContainer>
		);
	}

	return (
		<StyledTableContainer>
			<Table aria-label={__('Scan results', 'pojo-accessibility')}>
				<TableHead>
					<TableRow>
						<TableCell>{__('Page', 'pojo-accessibility')}</TableCell>
						<TableCell>{__('URL', 'pojo-accessibility')}</TableCell>
						<TableCell>{__('Last scan', 'pojo-accessibility')}</TableCell>
						<TableCell>{__('Issues resolved', 'pojo-accessibility')}</TableCell>
						<TableCell role="presentation" />
						<TableCell>
							<VisuallyHidden>
								<Typography as="span">
									{__('Actions', 'pojo-accessibility')}
								</Typography>
							</VisuallyHidden>
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{scannerResults.map((result, index) => {
						const resolvedPercentage = result.issues_total
							? Math.round((result.issues_fixed / result.issues_total) * 100)
							: 0;

						return (
							<Fragment key={result.id}>
								<TableRow>
									<TableCell component="th" scope="row">
										{result.page_title}
									</TableCell>

									<TableCell>{result.page_url}</TableCell>

									<TableCell>{formatDate(result.last_scan)}</TableCell>

									<TableCell>
										<StyledProgressContainer>
											<StyledLinearProgress
												value={resolvedPercentage}
												variant="determinate"
												color="secondary"
											/>
											{result.issues_fixed}/{result.issues_total}
											<AccessibilityAssistantResultsTableProgressChip
												percentage={resolvedPercentage}
											/>
										</StyledProgressContainer>
									</TableCell>

									<TableCell role="presentation" />

									<TableCell>
										<StyledControlsContainer>
											<AccessibilityAssistantTooltip
												content={__('View scan history', 'pojo-accessibility')}
											>
												<span role="none">
													<StyledHistoryButton
														color="secondary"
														size="small"
														startIcon={<HistoryIcon />}
														endIcon={
															openRows[index] ? (
																<ChevronUpIcon />
															) : (
																<ChevronDownIcon />
															)
														}
														aria-label={__(
															'View scan history',
															'pojo-accessibility',
														)}
														disabled={!result.scans.length}
														onClick={() => handleToggleRow(index)}
													/>
												</span>
											</AccessibilityAssistantTooltip>

											<AccessibilityAssistantResultsTableCTA
												percentage={resolvedPercentage}
												pageUrl={result.page_url}
											/>
										</StyledControlsContainer>
									</TableCell>
								</TableRow>

								{openRows[index] &&
									result.scans.map((scan, scanIndex) => {
										const resolvedScanPercentage = result.issues_total
											? Math.round(
													(result.issues_fixed / result.issues_total) * 100,
												)
											: 0;

										return (
											<StyledScanRow
												key={`${result.page_title}-scan-${scanIndex}`}
											>
												<TableCell colSpan={2} />
												<TableCell>{formatDate(scan.date)}</TableCell>
												<TableCell>
													<StyledProgressContainer>
														<StyledLinearProgress
															value={resolvedScanPercentage}
															variant="determinate"
															color="secondary"
														/>
														{scan.issues_fixed}/{scan.issues_total}
														<AccessibilityAssistantResultsTableProgressChip
															percentage={resolvedScanPercentage}
														/>
													</StyledProgressContainer>
												</TableCell>
												<TableCell colSpan={2} />
											</StyledScanRow>
										);
									})}
							</Fragment>
						);
					})}
				</TableBody>

				<TableFooter>
					<TableRow disableDivider>
						<AccessibilityAssistantResultsPagination />
					</TableRow>
				</TableFooter>
			</Table>
		</StyledTableContainer>
	);
};

AccessibilityAssistantResultsTable.propTypes = {
	scannerResults: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
};

const StyledTableContainer = styled(TableContainer)`
	margin-top: ${({ theme }) => theme.spacing(3)};
`;

const StyledProgressContainer = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledControlsContainer = styled(Box)`
	display: flex;
	align-items: center;
`;

const ForwardedButton = forwardRef((props, ref) => (
	<Button ref={ref} {...props} />
));

const StyledHistoryButton = styled(ForwardedButton)`
	min-width: 50px;
	max-width: 50px;

	span {
		margin: 0;
	}

	span:first-of-type {
		margin-inline-end: ${({ theme }) => theme.spacing(1)};
	}
`;

const StyledLinearProgress = styled(LinearProgress)`
	width: 89px;
`;

const StyledScanRow = styled(TableRow)`
	background-color: #f9f9f9;
`;

export default AccessibilityAssistantResultsTable;
