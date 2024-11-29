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

	// Icon Design
	const [widgetIcon, setWidgetIcon] = useState('person');
	const [widgetIconSize, setWidgetIconSize] = useState('medium');
	const [widgetIconColor, setWidgetIconColor] = useState('#2563eb');
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
				widgetIcon,
				setWidgetIcon,
				widgetIconSize,
				setWidgetIconSize,
				widgetIconColor,
				setWidgetIconColor,
				iconPosition,
				setIconPosition,
				iconDesign,
				setIconDesign,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};
