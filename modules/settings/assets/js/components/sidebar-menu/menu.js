import { PagesIcon } from '@elementor/icons';
import { WidgetIcon } from '../../icons';
import { AccessibilityStatement, Menu, IconSettings } from '../../pages';

export const MenuItems = {
	widget: {
		name: 'Widget',
		key: 'widget',
		icon: <WidgetIcon />,
		children: {
			iconSettings: {
				name: 'Icon Settings',
				key: 'icon-settings',
				page: <IconSettings />,
			},
			menu: {
				name: 'Menu',
				key: 'menu',
				page: <Menu />,
			},
		},
	},
	accessibilityStatement: {
		name: 'Accessibility Statement',
		key: 'accessibility-statement',
		page: <AccessibilityStatement />,
		icon: <PagesIcon />,
	},
};
