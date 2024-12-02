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

	// Track settings changes to enable/disable Save Changes button
	const [hasChanges, setHasChanges] = useState(false);
	return (
		<SettingsContext.Provider
			value={{
				openSidebar,
				setOpenSidebar,
				selectedMenu,
				setSelectedMenu,
				widgetMenuSettings,
				setWidgetMenuSettings,
				hasChanges,
				setHasChanges,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
