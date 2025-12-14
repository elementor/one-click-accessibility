import ChecklistIcon from '@elementor/icons/ChecklistIcon';
import PagesIcon from '@elementor/icons/PagesIcon';
import { WidgetIcon } from '@ea11y/icons';
import {
	AccessibilityAssistant,
	AccessibilityStatement,
	Analytics,
	IconSettings,
	Menu,
} from '@ea11y/pages';
import { __ } from '@wordpress/i18n';
import { AccessibilityAssistantContextProvider } from '../../contexts/accessibility-assistant-context';
import AccessibilityStatementTooltip from './tooltips/accessibility-statement';
import AnalyticsTooltip from './tooltips/analytics';

export const MenuItems = {
	scans: {
		key: 'scan-overview',
		name: __('Accessibility scans', 'pojo-accessibility'),
		icon: <ChecklistIcon aria-hidden={true} sx={{ color: 'common.black' }} />,
		page: (
			<AccessibilityAssistantContextProvider>
				<AccessibilityAssistant />
			</AccessibilityAssistantContextProvider>
		),
	},
	widget: {
		key: 'widget',
		name: __('Widget', 'pojo-accessibility'),
		icon: <WidgetIcon aria-hidden={true} sx={{ color: 'common.black' }} />,
		children: {
			design: {
				key: 'design',
				name: __('Design', 'pojo-accessibility'),
				page: <IconSettings />,
			},
			capabilities: {
				key: 'capabilities',
				name: __('Capabilities', 'pojo-accessibility'),
				page: <Menu />,
			},
			analytics: {
				key: 'analytics',
				name: __('Analytics', 'pojo-accessibility'),
				proIcon: 'analytics',
				infotip: <AnalyticsTooltip />,
				page: <Analytics />,
			},
		},
	},
	accessibilityStatement: {
		key: 'accessibility-statement',
		name: __('Statement', 'pojo-accessibility'),
		icon: <PagesIcon aria-hidden={true} sx={{ color: 'common.black' }} />,
		infotip: <AccessibilityStatementTooltip />,
		page: <AccessibilityStatement />,
	},
};
