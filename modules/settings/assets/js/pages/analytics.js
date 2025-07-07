import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import { AnalyticsToggle, ChartsList } from '@ea11y/components/analytics';
import UpgradeModal from '@ea11y/components/upgrade-modal';
import {
	StyledBox,
	StyledTitle,
	StyledWideBox,
} from '@ea11y/pages/pages.styles';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../contexts/analytics-context';

const Analytics = () => {
	const { isProVersion } = useAnalyticsContext();

	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.pageView, {
			page: 'Analytics',
		});
	}, []);

	return (
		<StyledBox sx={{ position: 'relative' }}>
			<StyledWideBox>
				<StyledWrap>
					<StyledTitle
						variant="h4"
						color="text.primary"
						sx={{ mb: 0, position: 'relative', zIndex: 3 }}
					>
						{__('Analytics', 'pojo-accessibility')}
					</StyledTitle>
					<AnalyticsToggle />
				</StyledWrap>
				<ChartsList />
			</StyledWideBox>
			{!isProVersion && (
				<Blur>
					<UpgradeModal />
				</Blur>
			)}
		</StyledBox>
	);
};

const Blur = styled(Box)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	backdrop-filter: blur(5px);
	z-index: 2;
`;

const StyledWrap = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	max-width: 1200px;

	margin-bottom: 40px;
	margin-right: auto;
	margin-left: auto;
`;

export default Analytics;
