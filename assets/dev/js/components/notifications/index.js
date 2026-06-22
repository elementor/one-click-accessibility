import BulbIcon from '@elementor/icons/BulbIcon';
import Alert from '@elementor/ui/Alert';
import Snackbar from '@elementor/ui/Snackbar';
import { styled } from '@elementor/ui/styles';
import { useNotificationSettings } from '@ea11y-apps/global/hooks/use-notifications';

const Notifications = ({ type, message }) => {
	const {
		showNotification,
		setShowNotification,
		setNotificationMessage,
		setNotificationType,
	} = useNotificationSettings();

	const closeNotification = () => {
		setShowNotification(false);
		setNotificationMessage('');
		setNotificationType('');
	};

	const getAutoHideDuration = () => {
		switch (type) {
			case 'error':
				return 10000;
			case 'hint':
				return 8000;
			default:
				return 2000;
		}
	};

	const isHint = type === 'hint';

	return (
		<Snackbar
			open={showNotification}
			autoHideDuration={getAutoHideDuration()}
			onClose={closeNotification}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			sx={{ zIndex: 99999 }}
		>
			<StyledAlert
				onClose={closeNotification}
				severity={isHint ? 'info' : type}
				variant="filled"
				icon={isHint ? <BulbIcon /> : undefined}
				$isHint={isHint}
			>
				{message}
			</StyledAlert>
		</Snackbar>
	);
};

const StyledAlert = styled(Alert, {
	shouldForwardProp: (prop) => '$isHint' !== prop,
})`
	${({ $isHint, theme }) =>
		$isHint &&
		`
		background-color: #2d2d2d;
		color: ${theme.palette.common.white};

		& .MuiAlert-action {
			color: ${theme.palette.common.white};
		}

		& a {
			color: #3F8CFF;
			text-decoration: underline;
		}
	`}
`;

export default Notifications;
