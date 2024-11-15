import Box from '@elementor/ui/Box';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { ColorPicker, IconSelect, IconSize } from '../components';

const IconDesignSettings = ( props ) => {
	return (
		<Grid padding={ 2 }
			border={ 1 }
			borderColor="divider"
			{ ...props }>
			<Box marginBottom={ 2 }>
				<Typography variant="subtitle1">{ __( 'Design', 'pojo-accessibility' ) }</Typography>
				<Typography variant="body2">{ __( 'Customize the design of the button that visitors use to open the widget.', 'pojo-accessibility' ) }</Typography>
			</Box>
			<Grid gridTemplateColumns="repeat(2, 1fr)"
				display="grid"
				gap={ 8 }>
				<Box display="flex"
					flexDirection="column"
					gap={ 5 }>
					<IconSelect />
					<IconSize />
				</Box>
				<Box>
					<ColorPicker />
				</Box>
			</Grid>
		</Grid>
	);
};

export default IconDesignSettings;
