import Alert from '@elementor/ui/Alert';
import Snackbar from '@elementor/ui/Snackbar';
import { useNotificationSettings } from '@ea11y/hooks';

const Notifications = ({ type, message }) => {
	const {
		showNotification,
		setShowNotification,
		setNotificationMessage,
		setNotificationType,
	} = useNotificationSettings();

	const closeNotification = () => {
		setShowNotification(!showNotification);
		setNotificationMessage('');
		setNotificationType('');
	};

	return (
		<Snackbar
			open={showNotification}
			autoHideDuration={type === 'error' ? 10000 : 2000}
			onClose={closeNotification}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			sx={{ zIndex: 99999 }}
		>
			<Alert
				onClose={() => setShowNotification(!showNotification)}
				severity={type}
				variant="filled"
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default Notifications;
