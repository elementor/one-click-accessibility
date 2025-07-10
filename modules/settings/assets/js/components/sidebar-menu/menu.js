import { ChecklistIcon, PagesIcon, SettingsIcon } from '@elementor/icons';
import { WidgetIcon, AnalyticsIcon } from '@ea11y/icons';
import {
	AccessibilityStatement,
	Menu,
	IconSettings,
	Analytics,
	AccessibilityAssistant,
} from '@ea11y/pages';
import { __ } from '@wordpress/i18n';
import { AccessibilityAssistantContextProvider } from '../../contexts/accessibility-assistant-context';
import AccessibilityStatementTooltip from './tooltips/accessibility-statement';

export const MenuItems = {
	scanner: {
		name: __('Accessibility scans', 'pojo-accessibility'),
		key: 'scanner',
		type: 'heading',
	},
	scanOverview: {
		name: __('Scans', 'pojo-accessibility'),
		key: 'scan-overview',
		page: (
			<AccessibilityAssistantContextProvider>
				<AccessibilityAssistant />
			</AccessibilityAssistantContextProvider>
		),
		icon: (
			<ChecklistIcon
				role="img"
				aria-label={__('Scan overview', 'pojo-accessibility')}
				aria-hidden={false}
				sx={{ color: 'common.black' }}
			/>
		),
	},
	widget: {
		name: __('Widget', 'pojo-accessibility'),
		key: 'widget',
		type: 'heading',
	},
	design: {
		name: __('Design', 'pojo-accessibility'),
		key: 'design',
		page: <IconSettings />,
		icon: (
			<WidgetIcon
				role="img"
				aria-label={__('Design', 'pojo-accessibility')}
				aria-hidden={false}
			/>
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
				aria-hidden={false}
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
				aria-hidden={false}
				size="small"
				sx={{ color: 'common.black' }}
			/>
		),
		infotip: <AccessibilityStatementTooltip />,
	},
	analytics: {
		name: __('Analytics', 'pojo-accessibility'),
		key: 'analytics',
		page: <Analytics />,
		proIcon: 'analytics',
		icon: (
			<AnalyticsIcon
				role="img"
				aria-label={__('Analytics', 'pojo-accessibility')}
				aria-hidden={false}
				size="small"
				sx={{ color: 'common.black' }}
			/>
		),
	},
};
