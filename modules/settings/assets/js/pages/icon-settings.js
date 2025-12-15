import { styled } from '@elementor/ui/styles';
import { BottomBar } from '@ea11y/components';
import { IconDesignSettings, PositionSettings } from '@ea11y/layouts';
import {
	StyledBox,
	StyledWideBox,
	StyledTitle,
} from '@ea11y/pages/pages.styles';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const IconSettings = () => {
	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.pageView, {
			page: 'Button',
		});
	}, []);

	return (
		<StyledBox>
			<StyledWideBox>
				<StyledPageTitle variant="h5">
					{__('Design', 'pojo-accessibility')}
				</StyledPageTitle>

				<IconDesignSettings marginBottom={4} />

				<PositionSettings />
			</StyledWideBox>
			<BottomBar />
		</StyledBox>
	);
};

export default IconSettings;

const StyledPageTitle = styled(StyledTitle)`
	max-width: 1200px;
	margin: 0 auto 24px;
`;
