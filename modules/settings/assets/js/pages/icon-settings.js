import Container from '@elementor/ui/Container';
import Typography from '@elementor/ui/Typography';
import { BottomBar } from '@ea11y/components';
import { IconDesignSettings, PositionSettings } from '@ea11y/layouts';
import { __ } from '@wordpress/i18n';

const IconSettings = () => {
	return (
		<>
			<Container p={1} sx={{ overflow: 'auto', maxHeight: '100%', padding: 4 }}>
				<Typography variant="h4" fontWeight="400" marginBottom={4}>
					{__('Icon Settings', 'pojo-accessibility')}
				</Typography>
				<IconDesignSettings marginBottom={4} />
				<PositionSettings />
			</Container>
			<BottomBar />
		</>
	);
};

export default IconSettings;
