import { useState, createContext, useContext } from '@wordpress/element';

/**
 * Context Component.
 */
const SettingsContext = createContext(null);

export function useSettings() {
	return useContext(SettingsContext);
}

export const SettingsProvider = ({ children }) => {
	const [openSidebar, setOpenSidebar] = useState(true);
	const [selectedMenu, setSelectedMenu] = useState({
		parent: 'widget',
		child: 'iconSettings',
	});
	const [widgetMenuSettings, setWidgetMenuSettings] = useState({
		'content-adjustments': {
			'text-size': true,
			'line-height': true,
			'align-text': true,
			'readable-font': true,
		},
		'color-adjustments': {
			greyscale: true,
			contrast: true,
		},
		'orientation-adjustments': {
			'page-structure': true,
			'site-map': true,
			'reading-panel': true,
			'hide-images': true,
			'pause-animations': true,
			'highlight-links': true,
		},
	});

	const [planData, setPlanData] = useState(null);

	// Track settings changes to enable/disable Save Changes button
	const [hasChanges, setHasChanges] = useState(false);
	const [hideMinimumOptionAlert, setHideMinimumOptionAlert] = useState(false);
	const [iconDesign, setIconDesign] = useState({
		icon: 'person',
		size: 'medium',
		color: '#2563eb',
	});

	// Icon Position
	const [iconPosition, setIconPosition] = useState({
		desktop: {
			hidden: false,
			enableExactPosition: false,
			exactPosition: {
				horizontal: {
					direction: 'to-left',
					value: 10,
					unit: 'px',
				},
				vertical: {
					direction: 'higher',
					value: 10,
					unit: 'px',
				},
			},
			position: 'top-left',
		},
		mobile: {
			hidden: false,
			enableExactPosition: false,
			exactPosition: {
				horizontal: {
					direction: 'to-right',
					value: 10,
					unit: 'px',
				},
				vertical: {
					direction: 'lower',
					value: 10,
					unit: 'px',
				},
			},
			position: 'top-left',
		},
	});

	const [companyData, setCompanyData] = useState({
		company_name: 'Acme Inc.',
		company_website: 'https://www.acme.com/',
		company_email: 'contact@acme.com',
		current_date: new Date().toLocaleDateString(),
	});

	const [accessibilityStatementData, setAccessibilityStatementData] = useState({
		statement: null,
		pageId: null,
		createdOn: null,
	});

	return (
		<SettingsContext.Provider
			value={{
				openSidebar,
				setOpenSidebar,
				selectedMenu,
				setSelectedMenu,
				widgetMenuSettings,
				setWidgetMenuSettings,
				hideMinimumOptionAlert,
				setHideMinimumOptionAlert,
				iconPosition,
				setIconPosition,
				iconDesign,
				setIconDesign,
				hasChanges,
				setHasChanges,
				planData,
				setPlanData,
				companyData,
				setCompanyData,
				accessibilityStatementData,
				setAccessibilityStatementData,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
