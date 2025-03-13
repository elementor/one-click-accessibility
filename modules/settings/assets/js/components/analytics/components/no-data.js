import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

export const NoData = () => (
	<Box
		display="flex"
		alignItems="center"
		justifyContent="center"
		flexDirection="column"
		sx={{ height: '250px' }}
	>
		<Typography variant="body2" color="text.tertiary">
			{__('No data available', 'pojo-accessibility')}
		</Typography>
	</Box>
);
