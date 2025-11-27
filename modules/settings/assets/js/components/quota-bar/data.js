import { __ } from '@wordpress/i18n';

export const QuotaBarData = {
	visits: {
		title: __('Widget loads', 'pojo-accessibility'),
		infotipDescription: __(
			'This is how many times your widget loads for each unique IP/device in a 24-hour span across your sites this month. Upgrade if you’re nearing your limit to keep all features available.',
			'pojo-accessibility',
		),
	},
	scanner: {
		title: __('Pages scanned', 'pojo-accessibility'),
		infotipDescription: __(
			'This shows how many URLs you’ve scanned for accessibility in total. If you’re reaching your limit, consider upgrading to keep scanning new pages.',
			'pojo-accessibility',
		),
	},
	ai: {
		title: __('AI credits', 'pojo-accessibility'),
		infotipDescription: __(
			'This is how many AI credits you’ve used to resolve issues or to generate content. Upgrade if you’re nearing your plan limit to keep full functionality.',
			'pojo-accessibility',
		),
		lockedDescription: __(
			'Upgrade your plan to unlock AI credits for generating alt‑text, one‑click accessibility fixes, and more.',
			'pojo-accessibility',
		),
	},
};
