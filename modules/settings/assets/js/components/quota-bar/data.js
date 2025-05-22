import { __ } from '@wordpress/i18n';

export const QuotaBarData = {
	visits: {
		title: __('Widget loads', 'pojo-accessibility'),
		infotipDescription: __(
			'This shows how many times your accessibility widget has loaded for unique visitors across all your connected sites this monthly cycle (each IP/device is counted once per 24 hours). If you’re nearing your plan’s monthly limit, you can upgrade to keep all features available.',
			'pojo-accessibility',
		),
	},
	scanner: {
		title: __('Pages scanned', 'pojo-accessibility'),
		infotipDescription: __(
			'This shows how many times your accessibility widget has loaded for unique visitors across all your connected sites this monthly cycle (each IP/device is counted once per 24 hours). If you’re nearing your plan’s monthly limit, you can upgrade to keep all features available.',
			'pojo-accessibility',
		),
	},
	ai: {
		title: __('AI credits', 'pojo-accessibility'),
		infotipDescription: __(
			'This shows how many times your accessibility widget has loaded for unique visitors across all your connected sites this monthly cycle (each IP/device is counted once per 24 hours). If you’re nearing your plan’s monthly limit, you can upgrade to keep all features available.',
			'pojo-accessibility',
		),
	},
};
