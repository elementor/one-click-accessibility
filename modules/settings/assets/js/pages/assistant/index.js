import AccessibilityAssistantEmptyState from '@ea11y/pages/assistant/empty-state';
import AccessibilityAssistantHeading from '@ea11y/pages/assistant/heading';
import AccessibilityAssistantResultsHeading from '@ea11y/pages/assistant/results/heading';
import AccessibilityAssistantResultsTable from '@ea11y/pages/assistant/results/table';
import AccessibilityAssistantStats from '@ea11y/pages/assistant/stats';
import { StyledBox, StyledContainer } from '@ea11y/pages/pages.styles';
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

	return (
		<>
			<StyledBox sx={{ backgroundColor: '#F3F3F4', minHeight: 'initial' }}>
				<StyledContainer>
					<AccessibilityAssistantHeading
						period={period}
						onPeriodChange={onPeriodChange}
						loading={loading}
					/>

					<AccessibilityAssistantStats stats={stats} loading={loading} />
				</StyledContainer>
			</StyledBox>

			<StyledBox>
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

export default AccessibilityAssistant;
