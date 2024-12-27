import { PagesIcon } from '@elementor/icons';
import { WidgetIcon } from '@ea11y/icons';
import { AccessibilityStatement, Menu, IconSettings } from '@ea11y/pages';
import { __ } from '@wordpress/i18n';

export const MenuItems = {
	widget: {
		name: __('Accessibility Widget', 'pojo-accessibility'),
		key: 'widget',
		icon: <WidgetIcon />,
		children: {
			iconSettings: {
				name: __('Design & position', 'pojo-accessibility'),
				key: 'icon-settings',
				page: <IconSettings />,
			},
			menu: {
				name: __('Feature management', 'pojo-accessibility'),
				key: 'menu',
				page: <Menu />,
			},
		},
	},
	accessibilityStatement: {
		name: __('Accessibility statement', 'pojo-accessibility'),
		key: 'accessibility-statement',
		page: <AccessibilityStatement />,
		icon: <PagesIcon />,
	},
};
