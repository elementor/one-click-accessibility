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
				<StyledTitle
					variant="h4"
					color="text.primary"
					sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
				>
					{__('Design', 'pojo-accessibility')}
				</StyledTitle>

				<IconDesignSettings marginBottom={4} />

				<PositionSettings />
			</StyledWideBox>
			<BottomBar />
		</StyledBox>
	);
};

export default IconSettings;
