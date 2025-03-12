import { PagesIcon, SettingsIcon } from '@elementor/icons';
import { WidgetIcon } from '@ea11y/icons';
import { AccessibilityStatement, Menu, IconSettings } from '@ea11y/pages';
import { __ } from '@wordpress/i18n';
import AccessibilityStatementTooltip from './tooltips/accessibility-statement';

export const MenuItems = {
	design: {
		name: __('Design', 'pojo-accessibility'),
		key: 'design',
		page: <IconSettings />,
		icon: (
			<WidgetIcon role="img" aria-label={__('Design', 'pojo-accessibility')} />
		),
	},
	capabilities: {
		name: __('Capabilities', 'pojo-accessibility'),
		key: 'capabilities',
		page: <Menu />,
		icon: (
			<SettingsIcon
				role="img"
				aria-label={__('Capabilities', 'pojo-accessibility')}
				size="small"
				sx={{ color: 'common.black' }}
			/>
		),
	},
	accessibilityStatement: {
		name: __('Statement', 'pojo-accessibility'),
		key: 'accessibility-statement',
		page: <AccessibilityStatement />,
		icon: (
			<PagesIcon
				role="img"
				aria-label={__('Statement', 'pojo-accessibility')}
				size="small"
				sx={{ color: 'common.black' }}
			/>
		),
		infotip: <AccessibilityStatementTooltip />,
	},
};
