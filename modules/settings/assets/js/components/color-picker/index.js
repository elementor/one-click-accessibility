import Box from '@elementor/ui/Box';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import './style.css';

const ColorPicker = () => {
	const [ color, setColor ] = useState( '#2563eb' );

	return (
		<FormControl>
			<FormLabel id="color-picker-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={ 1 }>
					{ __( 'Color', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<Grid padding={ 1 }
				border={ 1 }
				borderColor="divider"
				borderRadius={ 1 }
			>
				<HexColorPicker
					color={ color }
					onChange={ setColor }
					defaultValue="#fff"
					className="custom-color-picker"
				/>
				<Grid marginTop={ 2 } display="flex">
					<Box padding={ 2 }
						sx={ { backgroundColor: color } }
						borderRadius={ 1 }
						marginRight={ 1 }></Box>
					<HexColorInput color={ color }
						onChange={ setColor }
						style={ {
							width: '100%',
							border: '1px solid rgba(0, 0, 0, 0.12)',
							borderRadius: '3px',
							paddingLeft: '10px',
						} } />
				</Grid>
			</Grid>
		</FormControl>
	);
};

export default ColorPicker;
