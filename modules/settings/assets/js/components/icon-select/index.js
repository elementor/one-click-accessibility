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
	const [ selectedValue, setSelectedValue ] = useState( 'person' );
	const optionStyle = { color: 'info.main', fontSize: 44 };

	const options = [
		{ value: 'person', icon: <AccessibilityPersonIcon sx={ optionStyle } />, label: __( 'Accessibility Person Icon', 'pojo-accessibility' ) },
		{ value: 'eye', icon: <AccessibilityEyeIcon sx={ optionStyle } />, label: __( 'Accessibility Eye Icon', 'pojo-accessibility' ) },
		{ value: 'text', icon: <AccessibilityTextIcon sx={ optionStyle } />, label: __( 'Accessibility Text Badge Icon', 'pojo-accessibility' ) },
		{ value: 'controls', icon: <AccessibilityControlsIcon sx={ optionStyle } />, label: __( 'Accessibility Controls Slider Icon', 'pojo-accessibility' ) },
	];

	return (
		<FormControl>
			<FormLabel id="icon-select-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={ 1 }>
					{ __( 'Icon', 'pojo-accessibility' ) }
				</Typography>
			</FormLabel>
			<RadioGroup
				{ ...props }
				aria-labelledby="icon-select-radio-buttons-group-label"
				name="icon-select-radio-buttons-group"
				value={ selectedValue }
				sx={ {
					display: 'flex',
					flexDirection: 'row',
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
							flexGrow: 1,
							alignItems: 'center',
							justifyContent: 'center',
							gap: 1.5,
							p: 2,
							minWidth: 100,
							minHeight: 100,
							borderColor: selectedValue === option.value ? 'info.main' : 'divider',
							borderWidth: selectedValue === option.value ? 2 : 1,
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
