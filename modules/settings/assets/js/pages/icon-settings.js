import Container from '@elementor/ui/Container';
import Typography from '@elementor/ui/Typography';
import { BottomBar } from '@ea11y/components';
import { IconDesignSettings, PositionSettings } from '@ea11y/layouts';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const IconSettings = () => {
	useEffect(() => {
		mixpanelService.sendEvent('Page View', {
			page: 'Button',
		});
	}, []);
	return (
		<>
			<Container p={1} sx={{ overflow: 'auto', maxHeight: '100%', padding: 4 }}>
				<Typography variant="h4" fontWeight="400" marginBottom={4}>
					{__('Button', 'pojo-accessibility')}
				</Typography>
				<IconDesignSettings marginBottom={4} />
				<PositionSettings />
			</Container>
			<BottomBar />
		</>
	);
};

export default IconSettings;
