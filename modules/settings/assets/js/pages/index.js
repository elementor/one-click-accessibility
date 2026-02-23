import { lazy } from '@wordpress/element';

export const AccessibilityAssistant = lazy(
	() =>
		import(
			/* webpackChunkName: "chunk-page-accessibility-scans" */ './assistant'
		),
);
export const IconSettings = lazy(
	() => import(/* webpackChunkName: "chunk-page-design" */ './icon-settings'),
);
export const Menu = lazy(
	() => import(/* webpackChunkName: "chunk-page-capabilities" */ './menu'),
);
export const Analytics = lazy(
	() => import(/* webpackChunkName: "chunk-page-analytics" */ './analytics'),
);
export const AccessibilityStatement = lazy(
	() =>
		import(
			/* webpackChunkName: "chunk-page-accessibility-statement" */ './accessibility-statement'
		),
);
