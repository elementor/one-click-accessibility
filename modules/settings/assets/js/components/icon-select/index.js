import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Paper from '@elementor/ui/Paper';
import Radio from '@elementor/ui/Radio';
import RadioGroup from '@elementor/ui/RadioGroup';
import Typography from '@elementor/ui/Typography';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { AccessibilityControlsIcon, AccessibilityEyeIcon, AccessibilityPersonIcon, AccessibilityTextIcon } from '../../icons';

const IconSelect = ( props ) => {
	const [ selectedValue, setSelectedValue ] = useState( 'small' );

	const options = [
		{ value: 'person', icon: <AccessibilityPersonIcon />, label: __( 'Small (32px)', 'pojo-accessibility' ) },
		{ value: 'eye', icon: <AccessibilityEyeIcon />, label: __( 'Medium (44px)', 'pojo-accessibility' ) },
		{ value: 'text', icon: <AccessibilityTextIcon />, label: __( 'Large (64px)', 'pojo-accessibility' ) },
		{ value: 'controls', icon: <AccessibilityControlsIcon />, label: __( 'Extra Large (88px)', 'pojo-accessibility' ) },
	];

	return (
		<FormControl>
			<FormLabel id="icon-select-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2">
					{ __( 'Icon', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<RadioGroup
				{ ...props }
				aria-labelledby="icon-select-radio-buttons-group-label"
				name="icon-select-radio-buttons-group"
				value={ selectedValue }
				sx={ {
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: 2,
				} }
			>
				{ options.map( ( option ) => (
					<Paper
						key={ option.value }
						variant="outlined"
						onClick={ () => setSelectedValue( option.value ) }
						sx={ {
							borderRadius: 'md',
							boxShadow: 'sm',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: 1.5,
							p: 2,
							minWidth: 120,
							borderColor: selectedValue === option.value ? 'blue' : 'grey.300',
							borderWidth: selectedValue === option.value ? 1 : 1,
							cursor: 'pointer',
						} }
					>{ option.icon }
						<Radio value={ option.value } sx={ { opacity: 0, position: 'absolute' } } />
					</Paper>
				) ) }
			</RadioGroup>
		</FormControl>
	);
};

export default IconSelect;
