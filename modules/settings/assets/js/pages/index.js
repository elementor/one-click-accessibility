import { lazy } from '@wordpress/element';

export const AccessibilityStatement = lazy(
	() => import('./accessibility-statement'),
);
export const Analytics = lazy(() => import('./analytics'));
export const IconSettings = lazy(() => import('./icon-settings'));
export const Menu = lazy(() => import('./menu'));
export const AccessibilityAssistant = lazy(() => import('./assistant'));
