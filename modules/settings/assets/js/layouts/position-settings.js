import Box from '@elementor/ui/Box';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

const PositionSettings = () => {
	return (
		<Grid padding={ 2 }
			border={ 1 }
			borderColor="divider">
			<Box marginBottom={ 2 }>
				<Typography variant="subtitle1">{ __( 'Position', 'pojo-accessibility' ) }</Typography>
				<Typography variant="body2">{ __( 'Set where the widget appears on your site. This applies to all pages.', 'pojo-accessibility' ) }</Typography>
			</Box>
		</Grid>
	);
};

export default PositionSettings;
