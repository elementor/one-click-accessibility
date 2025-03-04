import Box from '@elementor/ui/Box';
import Container from '@elementor/ui/Container';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import SkipToContentSettings from '@ea11y/components/skip-to-content-settings';
import { MenuSettings, WidgetPreview } from '@ea11y/layouts';
import { eventNames, mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const StyledContainer = styled(Container)`
	overflow: auto;
	max-height: 100%;
	padding: ${({ theme }) => theme.spacing(5)};
`;

const Menu = () => {
	useEffect(() => {
		mixpanelService.sendEvent(eventNames.pageView, {
			page: 'Capabilities',
		});
	}, []);

	return (
		<StyledContainer>
			<Typography variant="h4" fontWeight="400" marginBottom={4}>
				{__('Capabilities', 'pojo-accessibility')}
			</Typography>

			<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={4}>
				<MenuSettings />
				<WidgetPreview />
			</Box>

			<SkipToContentSettings />
		</StyledContainer>
	);
};

export default Menu;
