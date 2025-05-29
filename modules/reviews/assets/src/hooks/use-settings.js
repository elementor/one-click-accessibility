import { useState, createContext, useContext } from '@wordpress/element';

/**
 * Context Component.
 */
const SettingsContext = createContext(null);

export function useSettings() {
	return useContext(SettingsContext);
}

const SettingsProvider = ({ children }) => {
	const [rating, setRating] = useState(0);
	const [feedback, setFeedback] = useState('');
	const [currentPage, setCurrentPage] = useState('ratings');
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const [isOpened, setIsOpened] = useState(true);

	// Notification
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationType, setNotificationType] = useState('');

	return (
		<SettingsContext.Provider
			value={{
				rating,
				setRating,
				feedback,
				setFeedback,
				currentPage,
				setCurrentPage,
				nextButtonDisabled,
				setNextButtonDisabled,
				showNotification,
				setShowNotification,
				notificationMessage,
				setNotificationMessage,
				notificationType,
				setNotificationType,
				isOpened,
				setIsOpened,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useNotifications = () => {
	const { setNotificationMessage, setNotificationType, setShowNotification } =
		useContext(SettingsContext);

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

export default SettingsProvider;
