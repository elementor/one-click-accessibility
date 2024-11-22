import { __ } from '@wordpress/i18n';
import { AccessibilityPersonIcon, AccessibilityTextIcon, AccessibilityEyeIcon, AccessibilityControlsIcon } from '../icons';

const options = () => {
	const optionStyle = {
		color: 'info.main',
		fontSize: 44,
	};

	return [
		{ value: 'person', icon: <AccessibilityPersonIcon sx={ optionStyle } />, label: __( 'Accessibility Person Icon', 'pojo-accessibility' ) },
		{ value: 'eye', icon: <AccessibilityEyeIcon sx={ optionStyle } />, label: __( 'Accessibility Eye Icon', 'pojo-accessibility' ) },
		{ value: 'text', icon: <AccessibilityTextIcon sx={ optionStyle } />, label: __( 'Accessibility Text Badge Icon', 'pojo-accessibility' ) },
		{ value: 'controls', icon: <AccessibilityControlsIcon sx={ optionStyle } />, label: __( 'Accessibility Controls Slider Icon', 'pojo-accessibility' ) },
	];
};

// Export the entire options array
export default options;

// Optionally, export a function to get a specific option by value
export const getOptionByValue = ( value ) => options().find( ( option ) => option.value === value );
