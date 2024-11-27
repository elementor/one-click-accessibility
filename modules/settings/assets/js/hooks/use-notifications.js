import { useState, createContext, useContext } from '@wordpress/element';

const NotificationsContext = createContext(undefined);

export function useNotificationSettings() {
	return useContext(NotificationsContext);
}

export const NotificationsProvider = ({ children }) => {
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationType, setNotificationType] = useState('');

	return (
		<NotificationsContext.Provider
			value={{
				showNotification,
				setShowNotification,
				notificationMessage,
				setNotificationMessage,
				notificationType,
				setNotificationType,
			}}
		>
			{children}
		</NotificationsContext.Provider>
	);
};

export const useToastNotification = () => {
	const { setNotificationMessage, setNotificationType, setShowNotification } =
		useContext(NotificationsContext);

	const error = (message) => {
		setNotificationMessage(message);
		setNotificationType('error');
		setShowNotification(true);
	};

	const success = (message) => {
		setNotificationMessage(message);
		setNotificationType('success');
		setShowNotification(true);
	};

	return {
		success,
		error,
	};
};
