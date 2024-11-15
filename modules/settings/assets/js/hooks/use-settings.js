import { useState, createContext, useContext } from '@wordpress/element';

/**
 * Context Component.
 */
const SettingsContext = createContext( null );

export function useSettings() {
	return useContext( SettingsContext );
}

export const SettingsProvider = ( { children } ) => {
	const [ openSidebar, setOpenSidebar ] = useState( true );
	const [ selectedMenu, setSelectedMenu ] = useState( { parent: 'widget', child: 'iconSettings' } );

	// Icon Design
	const [ widgetIcon, setWidgetIcon ] = useState( 'person' );
	const [ widgetIconSize, setWidgetIconSize ] = useState( 'medium' );
	const [ widgetIconColor, setWidgetIconColor ] = useState( '#000' );
	return (
		<SettingsContext.Provider
			value={ {
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
			} }
		>
			{ children }
		</SettingsContext.Provider>
	);
};
