import { lazy } from '@wordpress/element';

export const AccessibilityAssistant = lazy(
	() =>
		import(/* webpackChunkName: "page-accessibility-scans" */ './assistant'),
);
export const IconSettings = lazy(
	() => import(/* webpackChunkName: "page-design" */ './icon-settings'),
);
export const Menu = lazy(
	() => import(/* webpackChunkName: "page-capabilities" */ './menu'),
);
export const Analytics = lazy(
	() => import(/* webpackChunkName: "page-analytics" */ './analytics'),
);
export const AccessibilityStatement = lazy(
	() =>
		import(
			/* webpackChunkName: "page-accessibility-statement" */ './accessibility-statement'
		),
);
