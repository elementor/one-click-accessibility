import { __ } from '@wordpress/i18n';
import { FEATURE_MAPPER } from './index';

export const MENU_SETTINGS = {
	'content-adjustments': {
		title: __('Content Adjustments', 'pojo-accessibility'),
		options: {
			'bigger-text': FEATURE_MAPPER['bigger-text'],
			'bigger-line-height': FEATURE_MAPPER['bigger-line-height'],
			'text-align': FEATURE_MAPPER['text-align'],
			'readable-font': FEATURE_MAPPER['readable-font'],
		},
	},
	'orientation-adjustments': {
		title: __('Orientation Adjustments', 'pojo-accessibility'),
		options: {
			'page-structure': FEATURE_MAPPER['page-structure'],
			'screen-reader': FEATURE_MAPPER['screen-reader'],
			sitemap: FEATURE_MAPPER.sitemap,
			'reading-mask': FEATURE_MAPPER['reading-mask'],
			'language-selector': FEATURE_MAPPER['language-selector'],
			'hide-images': FEATURE_MAPPER['hide-images'],
			'pause-animations': FEATURE_MAPPER['pause-animations'],
			'highlight-links': FEATURE_MAPPER['highlight-links'],
			'focus-outline': FEATURE_MAPPER['focus-outline'],
		},
	},
	'color-adjustments': {
		title: __('Color Adjustments', 'pojo-accessibility'),
		options: {
			grayscale: FEATURE_MAPPER.grayscale,
			contrast: FEATURE_MAPPER.contrast,
		},
	},
};
