import {
	useState,
	createContext,
	useContext,
	useEffect,
} from '@wordpress/element';

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
		parent: '',
	});

	useEffect(() => {
		setSelectedMenu({
			parent: window.location.hash.replace('#', '') || 'scanOverview',
		});
	}, []);

	const [widgetMenuSettings, setWidgetMenuSettings] = useState({
		'bigger-text': {
			enabled: true,
		},
		'bigger-line-height': {
			enabled: true,
		},
		'text-align': {
			enabled: true,
		},
		'readable-font': {
			enabled: true,
		},
		grayscale: {
			enabled: true,
		},
		contrast: {
			enabled: true,
		},
		'page-structure': {
			enabled: true,
		},
		sitemap: {
			enabled: false,
		},
		'reading-mask': {
			enabled: true,
		},
		'hide-images': {
			enabled: true,
		},
		'pause-animations': {
			enabled: true,
		},
		'highlight-links': {
			enabled: true,
		},
		'focus-outline': {
			enabled: true,
		},
	});

	const [skipToContentSettings, setSkipToContentSettings] = useState({
		enabled: true,
	});

	const [planData, setPlanData] = useState(null);

	// Track settings changes to enable/disable Save Changes button
	const [hasChanges, setHasChanges] = useState(false);
	const [skipToContentHasChanges, setSkipToContentHasChanges] = useState(false);
	const [hasError, setHasError] = useState({
		sitemap: false,
		skipToContent: false,
	});
	const [hideMinimumOptionAlert, setHideMinimumOptionAlert] = useState(false);
	const [iconDesign, setIconDesign] = useState({
		icon: 'person',
		size: 'medium',
		color: '#2563eb',
		cornerRadius: {
			radius: 32,
			unit: 'px',
		},
	});

	// Icon Position
	const [iconPosition, setIconPosition] = useState({
		desktop: {
			hidden: false,
			enableExactPosition: false,
			exactPosition: {
				horizontal: {
					direction: 'left',
					value: 10,
					unit: 'px',
				},
				vertical: {
					direction: 'top',
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
					direction: 'right',
					value: 10,
					unit: 'px',
				},
				vertical: {
					direction: 'bottom',
					value: 10,
					unit: 'px',
				},
			},
			position: 'top-left',
		},
	});

	const [companyData, setCompanyData] = useState({
		company_name: '',
		company_website: '',
		company_email: '',
		current_date: new Date().toLocaleDateString(),
	});

	const [accessibilityStatementData, setAccessibilityStatementData] = useState({
		statement: null,
		pageId: null,
		createdOn: null,
		link: null,
		hideLink: false,
	});

	const [
		showAccessibilityGeneratedInfotip,
		setShowAccessibilityGeneratedInfotip,
	] = useState(false);

	const [planUsage, setPlanUsage] = useState(0);

	return (
		<SettingsContext.Provider
			value={{
				openSidebar,
				setOpenSidebar,
				selectedMenu,
				setSelectedMenu,
				widgetMenuSettings,
				setWidgetMenuSettings,
				skipToContentSettings,
				setSkipToContentSettings,
				skipToContentHasChanges,
				setSkipToContentHasChanges,
				hideMinimumOptionAlert,
				setHideMinimumOptionAlert,
				iconPosition,
				setIconPosition,
				iconDesign,
				setIconDesign,
				hasChanges,
				setHasChanges,
				hasError,
				setHasError,
				planData,
				setPlanData,
				companyData,
				setCompanyData,
				accessibilityStatementData,
				setAccessibilityStatementData,
				showAccessibilityGeneratedInfotip,
				setShowAccessibilityGeneratedInfotip,
				planUsage,
				setPlanUsage,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
