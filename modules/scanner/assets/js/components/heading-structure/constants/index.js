import AlertCircleIcon from '@elementor/icons/AlertCircleIcon';
import AlertTriangleFilledIcon from '@elementor/icons/AlertTriangleFilledIcon';
import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import { __ } from '@wordpress/i18n';

export const STATUS_CONFIG = Object.freeze({
	success: {
		icon: CircleCheckFilledIcon,
		iconColor: 'success',
		borderColor: '#d5d8dc',
		textColor: '#0C0D0E',
	},
	error: {
		icon: AlertTriangleFilledIcon,
		iconColor: 'error',
		borderColor: '#DC2626',
		textColor: '#DC2626',
	},
	warning: {
		icon: AlertCircleIcon,
		iconColor: 'warning',
		borderColor: '#D97706',
		textColor: '#0C0D0E',
	},
});

export const HEADING_LEVEL = Object.freeze({
	h1: __('H1 - Main heading', 'pojo-accessibility'),
	h2: __('H2 - Subheading', 'pojo-accessibility'),
	h3: __('H3 - Subsection heading', 'pojo-accessibility'),
	h4: __('H4 - Subsection of H3', 'pojo-accessibility'),
	h5: __('H5 - Subsection of H4', 'pojo-accessibility'),
	h6: __('H6 - Subsection of H5', 'pojo-accessibility'),
	p: __('P - Paragraph text', 'pojo-accessibility'),
});

export const HEADING_STATUS = Object.freeze({
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning',
});
