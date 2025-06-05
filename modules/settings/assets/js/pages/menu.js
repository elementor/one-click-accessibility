import Box from '@elementor/ui/Box';
import { BottomBar } from '@ea11y/components';
import SkipToContentSettings from '@ea11y/components/skip-to-content-settings';
import { MenuSettings, WidgetPreview } from '@ea11y/layouts';
import {
	StyledBox,
	StyledContainer,
	StyledTitle,
} from '@ea11y/pages/pages.styles';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const Menu = () => {
	useEffect(() => {
		mixpanelService.sendEvent(mixpanelEvents.pageView, {
			page: 'Capabilities',
		});
	}, []);

	return (
		<StyledBox>
			<StyledContainer>
				<StyledTitle variant="h4" color="text.primary">
					{__('Capabilities', 'pojo-accessibility')}
				</StyledTitle>

				<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={4}>
					<MenuSettings />
					<WidgetPreview />
				</Box>

				<SkipToContentSettings />
			</StyledContainer>
			<BottomBar />
		</StyledBox>
	);
};

export default Menu;
