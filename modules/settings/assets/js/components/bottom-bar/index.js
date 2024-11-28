import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import { __ } from '@wordpress/i18n';

const BottomBar = () => {
	return (
		<Box
			display="flex"
			justifyContent="end"
			p={ 2 }
			width="100%"
			borderTop="1px solid rgba(0, 0, 0, 0.12)">
			<Button variant="contained" color="info">
				{ __( 'Save Changes', 'pojo-accessibility' ) }
			</Button>
		</Box>
	);
};

export default BottomBar;
