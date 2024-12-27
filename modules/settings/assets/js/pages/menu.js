import Box from '@elementor/ui/Box';
import Container from '@elementor/ui/Container';
import Typography from '@elementor/ui/Typography';
import { MenuSettings, WidgetPreview } from '@ea11y/layouts';
import { __ } from '@wordpress/i18n';

const Menu = () => {
	return (
		<Container sx={{ overflow: 'auto', maxHeight: '100%', p: 5 }}>
			<Typography variant="h4" fontWeight="400" marginBottom={4}>
				{__('Feature management', 'pojo-accessibility')}
			</Typography>
			<Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={4}>
				<MenuSettings />
				<WidgetPreview />
			</Box>
		</Container>
	);
};

export default Menu;
