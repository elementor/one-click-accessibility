import Box from '@elementor/ui/Box';
import Container from '@elementor/ui/Container';
import { styled } from '@elementor/ui/styles';
import AccessibilityAssistantEmptyState from '@ea11y/pages/assistant/empty-state';
import AccessibilityAssistantHeading from '@ea11y/pages/assistant/heading';
import AccessibilityAssistantNoResultsState from '@ea11y/pages/assistant/no-results-state';
import AccessibilityAssistantResultsHeading from '@ea11y/pages/assistant/results/heading';
import AccessibilityAssistantResultsTable from '@ea11y/pages/assistant/results/table';
import AccessibilityAssistantStats from '@ea11y/pages/assistant/stats';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect } from '@wordpress/element';
import { useAccessibilityAssistantContext } from '../../contexts/accessibility-assistant-context';

const AccessibilityAssistant = () => {
	const {
		stats,
		loading,
		period,
		scannerResults,
		getFilteredScannerResults,
		onPeriodChange,
	} = useAccessibilityAssistantContext();

	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.pageView, {
			page: 'Dashboard',
		});
	}, []);

	if (!loading && !scannerResults.length) {
		return (
			<StyledBox>
				<StyledContainer>
					<AccessibilityAssistantHeading
						period={period}
						onPeriodChange={onPeriodChange}
						isEmpty
					/>

					<AccessibilityAssistantEmptyState />
				</StyledContainer>
			</StyledBox>
		);
	}

	if (
		!loading &&
		scannerResults.length &&
		!getFilteredScannerResults().length
	) {
		return (
			<>
				<StyledBox>
					<StyledHeadingWrapper>
						<StyledHeadingContainer>
							<AccessibilityAssistantHeading
								period={period}
								onPeriodChange={onPeriodChange}
								loading={loading}
							/>

							<AccessibilityAssistantStats
								stats={stats}
								loading={loading}
								noResultsState
							/>
						</StyledHeadingContainer>
					</StyledHeadingWrapper>

					<StyledContainer>
						<AccessibilityAssistantResultsHeading />
						<AccessibilityAssistantResultsTable
							scannerResults={getFilteredScannerResults()}
							loading={loading}
						/>
						<AccessibilityAssistantNoResultsState />
					</StyledContainer>
				</StyledBox>
			</>
		);
	}

	return (
		<>
			<StyledBox>
				<StyledHeadingWrapper>
					<StyledHeadingContainer>
						<AccessibilityAssistantHeading
							period={period}
							onPeriodChange={onPeriodChange}
							loading={loading}
						/>

						<AccessibilityAssistantStats stats={stats} loading={loading} />
					</StyledHeadingContainer>
				</StyledHeadingWrapper>

				<StyledContainer>
					<AccessibilityAssistantResultsHeading />
					<AccessibilityAssistantResultsTable
						scannerResults={getFilteredScannerResults()}
						loading={loading}
					/>
				</StyledContainer>
			</StyledBox>
		</>
	);
};

export const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	max-height: 100%;
	min-height: 50%;
	overflow: auto;
`;

const StyledHeadingWrapper = styled(Box)`
	background-color: #f3f3f4;
	width: 100%;
`;

const StyledHeadingContainer = styled(Container)`
	padding-top: ${({ theme }) => theme.spacing(4)};
	padding-bottom: ${({ theme }) => theme.spacing(4)};
	padding-left: ${({ theme }) => theme.spacing(4)};
	padding-right: ${({ theme }) => theme.spacing(4)};

	@media (min-width: ${({ theme }) => theme.breakpoints.values.xl}px) {
		padding-left: 0;
		padding-right: 0;
	}
`;

export const StyledContainer = styled(Container)`
	padding-top: ${({ theme }) => theme.spacing(4)};
	padding-bottom: ${({ theme }) => theme.spacing(4)};
	padding-left: ${({ theme }) => theme.spacing(4)};
	padding-right: ${({ theme }) => theme.spacing(4)};

	@media (min-width: ${({ theme }) => theme.breakpoints.values.xl}px) {
		padding-left: 0;
		padding-right: 0;
	}
`;

export default AccessibilityAssistant;
