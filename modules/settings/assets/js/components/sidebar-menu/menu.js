import { PagesIcon } from '@elementor/icons';
import { WidgetIcon } from '@ea11y/icons';
import { AccessibilityStatement, Menu, IconSettings } from '@ea11y/pages';
import { __ } from '@wordpress/i18n';
import AccessibilityStatementTooltip from './tooltips/accessibility-statement';

export const MenuItems = {
	widget: {
		name: __('Accessibility widget', 'pojo-accessibility'),
		key: 'widget',
		icon: <WidgetIcon size="small" />,
		children: {
			iconSettings: {
				name: __('Button', 'pojo-accessibility'),
				key: 'icon-settings',
				page: <IconSettings />,
			},
			menu: {
				name: __('Capabilities', 'pojo-accessibility'),
				key: 'menu',
				page: <Menu />,
			},
		},
	},
	accessibilityStatement: {
		name: __('Accessibility statement', 'pojo-accessibility'),
		key: 'accessibility-statement',
		page: <AccessibilityStatement />,
		icon: <PagesIcon size="small" sx={{ color: 'common.black' }} />,
		tooltip: <AccessibilityStatementTooltip />,
	},
};
