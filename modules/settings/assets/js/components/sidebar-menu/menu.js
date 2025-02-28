import { PagesIcon, SettingsIcon } from '@elementor/icons';
import { WidgetIcon } from '@ea11y/icons';
import AnalyticsIcon from '@ea11y/icons/analytics-icon';
import {
	AccessibilityStatement,
	Menu,
	IconSettings,
	Analytics,
} from '@ea11y/pages';
import { __ } from '@wordpress/i18n';
import AccessibilityStatementTooltip from './tooltips/accessibility-statement';

export const MenuItems = {
	design: {
		name: __('Design', 'pojo-accessibility'),
		key: 'design',
		page: <IconSettings />,
		icon: <WidgetIcon />,
	},
	capabilities: {
		name: __('Capabilities', 'pojo-accessibility'),
		key: 'capabilities',
		page: <Menu />,
		icon: <SettingsIcon size="small" sx={{ color: 'common.black' }} />,
	},
	accessibilityStatement: {
		name: __('Statement', 'pojo-accessibility'),
		key: 'accessibility-statement',
		page: <AccessibilityStatement />,
		icon: <PagesIcon size="small" sx={{ color: 'common.black' }} />,
		infotip: <AccessibilityStatementTooltip />,
	},
	analytics: {
		name: __('Analytics', 'pojo-accessibility'),
		key: 'analytics',
		page: <Analytics />,
		icon: (
			<AnalyticsIcon
				role="img"
				aria-label={__('Analytics', 'pojo-accessibility')}
				size="small"
				sx={{ color: 'common.black' }}
			/>
		),
	},
};
