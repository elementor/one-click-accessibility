import AlertCircleIcon from '@elementor/icons/AlertCircleIcon';
import AlertTriangleFilledIcon from '@elementor/icons/AlertTriangleFilledIcon';
import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import MenuItem from '@elementor/ui/MenuItem';
import Typography from '@elementor/ui/Typography';
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
	h1: __('Main heading', 'pojo-accessibility'),
	h2: __('Subheading', 'pojo-accessibility'),
	h3: __('Subsection heading', 'pojo-accessibility'),
	h4: __('Subsection of H3', 'pojo-accessibility'),
	h5: __('Subsection of H4', 'pojo-accessibility'),
	h6: __('Subsection of H5', 'pojo-accessibility'),
	p: __('Mark as regular text', 'pojo-accessibility'),
});

export const HEADING_OPTIONS = Object.entries(HEADING_LEVEL).map(
	([key, label]) => (
		<MenuItem key={key} value={key} dense>
			<Typography sx={{ fontSize: '14px' }}>
				<b>{key.toUpperCase()}</b> - {label}
			</Typography>
		</MenuItem>
	),
);

export const VIOLATION_PARAMS = Object.freeze({
	missing_h1_check: {
		title: __('Missing a H1 main heading', 'pojo-accessibility'),
		description: __(
			'Change this to a H1, or choose a different heading as the H1 for this page.',
			'pojo-accessibility',
		),
	},
	single_h1_check: {
		title: __('More than one H1 main heading', 'pojo-accessibility'),
		description: __(
			'Change one of your H1s to a different level that makes sense for your structure.',
			'pojo-accessibility',
		),
	},
	heading_hierarchy_check: {
		title: __('Heading skips a level', 'pojo-accessibility'),
		description: __(
			'Change this heading so it’s in sequence with the levels above and below it.',
			'pojo-accessibility',
		),
	},
});
