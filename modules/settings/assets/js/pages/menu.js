import Box from '@elementor/ui/Box';
import { styled } from '@elementor/ui/styles';
import { BottomBar } from '@ea11y/components';
import SkipToContentSettings from '@ea11y/components/skip-to-content-settings';
import { MenuSettings, WidgetPreview } from '@ea11y/layouts';
import {
	StyledBox,
	StyledWideBox,
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
			<StyledWideBox>
				<StyledPageTitle variant="h5">
					{__('Capabilities', 'pojo-accessibility')}
				</StyledPageTitle>

				<StyledSettingsWrapper>
					<MenuSettings />
					<WidgetPreview />
				</StyledSettingsWrapper>

				<SkipToContentSettings />
			</StyledWideBox>
			<BottomBar />
		</StyledBox>
	);
};

export default Menu;

const StyledSettingsWrapper = styled(Box)`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: ${({ theme }) => theme.spacing(4)};
	max-width: 1200px;
	margin-left: auto;
	margin-right: auto;
`;

const StyledPageTitle = styled(StyledTitle)`
	max-width: 1200px;
	margin: 0 auto 24px;
`;
