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
	return (
		<SettingsContext.Provider
			value={ {
				openSidebar,
				setOpenSidebar,
				selectedMenu,
				setSelectedMenu,
			} }
		>
			{ children }
		</SettingsContext.Provider>
	);
};
