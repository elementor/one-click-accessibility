import CloseButton from '@elementor/ui/CloseButton';
import Snackbar from '@elementor/ui/Snackbar';
import SnackbarContent from '@elementor/ui/SnackbarContent';
import { useSettings } from '../hooks/use-settings';

const ReviewNotifications = ({ type, message }) => {
	const {
		showNotification,
		setShowNotification,
		setNotificationMessage,
		setNotificationType,
	} = useSettings();

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
			<SnackbarContent
				message={message}
				action={<CloseButton color="inherit" onClick={closeNotification} />}
			/>
		</Snackbar>
	);
};

export default ReviewNotifications;
