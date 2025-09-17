import ReviewNotifications from './components/notification';
import { useSettings } from './hooks/use-settings';
import UserFeedbackForm from './layouts/user-feedback-form';
import './style.css';

const ReviewsApp = () => {
	const { notificationMessage, notificationType } = useSettings();

	return (
		<>
			<UserFeedbackForm />
			<ReviewNotifications
				message={notificationMessage}
				type={notificationType}
			/>
		</>
	);
};

export default ReviewsApp;
