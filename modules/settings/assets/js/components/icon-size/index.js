import FormControl from '@elementor/ui/FormControl';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import FormLabel from '@elementor/ui/FormLabel';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import { __ } from '@wordpress/i18n';

const IconSize = ( props ) => {
	const options = [
		{ value: 'small', label: __( 'Small (32px)', 'pojo-accessibility' ) },
		{ value: 'medium', label: __( 'Medium (44px)', 'pojo-accessibility' ) },
		{ value: 'large', label: __( 'Large (64px)', 'pojo-accessibility' ) },
	];
	return (
		<FormControl>
			<FormLabel id="demo-radio-buttons-group-label" color="secondary">{ __( 'Size', 'pojo-accessibility' ) }</FormLabel>
			<RadioGroup
				{ ...props }
				aria-labelledby="demo-radio-buttons-group-label"
				defaultValue="small"
				name="radio-buttons-group"
				row={ true }
			>
				{ options.map( ( option ) => (
					<FormControlLabel key={ option.value }
						value={ option.value }
						control={ <Radio size="small" /> }
						label={ option.label } />
				) )
				}
			</RadioGroup>
		</FormControl>
	);
};

export default IconSize;
