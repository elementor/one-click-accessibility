import { useState, createContext, useContext } from '@wordpress/element';

/**
 * Context Component.
 */
const SettingsContext = createContext( null );

export function useSettings() {
	return useContext( SettingsContext );
}

const SettingsProvider = ( { children } ) => {
	// Notification
	const [ showNotification, setShowNotification ] = useState( false );
	const [ notificationMessage, setNotificationMessage ] = useState( '' );
	const [ notificationType, setNotificationType ] = useState( '' );

	return (
		<SettingsContext.Provider
			value={ {
				showNotification,
				setShowNotification,
				notificationMessage,
				setNotificationMessage,
				notificationType,
				setNotificationType,
			} }
		>
			{ children }
		</SettingsContext.Provider>
	);
};

export const useToastNotification = () => {
	const { setNotificationMessage, setNotificationType, setShowNotification } = useContext( SettingsContext );

	const error = ( message ) => {
		setNotificationMessage( message );
		setNotificationType( 'error' );
		setShowNotification( true );
	};

	const success = ( message ) => {
		setNotificationMessage( message );
		setNotificationType( 'success' );
		setShowNotification( true );
	};

	return {
		success,
		error,
	};
};

export default SettingsProvider;
