import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { IconDesignSettings, PositionSettings } from '../layouts';

const IconSettings = () => {
	return (
		<>
			<Typography
				variant="h4"
				fontWeight="400"
				marginBottom={ 4 }>{ __( 'Icon Settings', 'pojo-accessibility' ) }</Typography>
			<IconDesignSettings marginBottom={ 4 } />
			<PositionSettings />
		</>
	);
};

export default IconSettings;
