import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Typography from '@elementor/ui/Typography';
import { ColorPicker as WPColorPicker } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ColorPicker = () => {
	const [ color, setColor ] = useState();

	return (
		<FormControl>
			<FormLabel id="color-picker-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={ 1 }>
					{ __( 'Color', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<WPColorPicker
				color={ color }
				onChange={ setColor }
				defaultValue="#000"
			/>
		</FormControl>
	);
};

export default ColorPicker;
