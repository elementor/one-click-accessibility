import Box from '@elementor/ui/Box';
import SkipToContentSettings from '@ea11y/components/skip-to-content-settings';
import { MenuSettings, WidgetPreview } from '@ea11y/layouts';
import {
	StyledBox,
	StyledContainer,
	StyledTitle,
} from '@ea11y/pages/pages.styles';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const Menu = () => {
	useEffect(() => {
		mixpanelService.sendEvent('page_view', {
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
		</StyledBox>
	);
};

export default Menu;
