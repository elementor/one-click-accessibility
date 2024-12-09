import { PagesIcon } from '@elementor/icons';
import { WidgetIcon } from '@ea11y/icons';
import { AccessibilityStatement, Menu, IconSettings } from '@ea11y/pages';
import { __ } from '@wordpress/i18n';

export const MenuItems = {
	widget: {
		name: __('Widget', 'pojo-accessibility'),
		key: 'widget',
		icon: <WidgetIcon />,
		children: {
			iconSettings: {
				name: __('Icon Settings', 'pojo-accessibility'),
				key: 'icon-settings',
				page: <IconSettings />,
			},
			menu: {
				name: __('Menu', 'pojo-accessibility'),
				key: 'menu',
				page: <Menu />,
			},
		},
	},
	accessibilityStatement: {
		name: __('Accessibility Statement', 'pojo-accessibility'),
		key: 'accessibility-statement',
		page: <AccessibilityStatement />,
		icon: <PagesIcon />,
	},
};