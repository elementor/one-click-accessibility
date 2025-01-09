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
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
