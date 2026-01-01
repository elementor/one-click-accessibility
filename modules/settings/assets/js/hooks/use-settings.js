import {
	useState,
	createContext,
	useContext,
	useEffect,
} from '@wordpress/element';
import { MenuItems } from '../components/sidebar-menu/menu';

/**
 * URL hash to the correct parent/child menu selection.
 *
 * @param {string} hash - The URL hash value (without #)
 * @return {Object} The selectedMenu object with parent and optionally child
 */
const hashToMenuId = (hash) => {
	const defaultHash = 'scans';

	if (!hash) {
		return { parent: defaultHash };
	}

	// Check if it's a parent key
	if (MenuItems[hash]) {
		return { parent: hash };
	}

	// Check if it's a child key
	for (const [parentKey, parentItem] of Object.entries(MenuItems)) {
		if (parentItem.children && parentItem.children[hash]) {
			return { parent: parentKey, child: hash };
		}
	}

	return { parent: defaultHash };
};

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
		const hash = window.location.hash.replace('#', '');
		const menuId = hashToMenuId(hash);
		setSelectedMenu(menuId);
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

	const [dismissedQuotaNotices, setDismissedQuotaNotices] = useState([]);

	const [isGetStartedModalOpen, setIsGetStartedModalOpen] = useState(false);

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
				dismissedQuotaNotices,
				setDismissedQuotaNotices,
				isGetStartedModalOpen,
				setIsGetStartedModalOpen,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
