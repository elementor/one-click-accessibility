import { useStorage } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState, createContext, useContext } from '@wordpress/element';
import { escapeHTML } from '@wordpress/escape-html';
import { __ } from '@wordpress/i18n';
import APIReview from '../api';

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
	const [isOpened, setIsOpened] = useState(true);
	const { save, get } = useStorage();

	// Notification
	const [showNotification, setShowNotification] = useState(false);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationType, setNotificationType] = useState('');

	const errorNotification = (message) => {
		setNotificationMessage(message);
		setNotificationType('error');
		setShowNotification(true);
	};

	const successNotification = (message) => {
		setNotificationMessage(message);
		setNotificationType('success');
		setShowNotification(true);
	};

	/**
	 * Close the popover.
	 * @param {Object} event
	 * @param {string} reason
	 */
	const handleClose = (event, reason) => {
		if ('backdropClick' !== reason) {
			setIsOpened(false);
		}

		mixpanelService.sendEvent(mixpanelEvents.review.dismissClicked);
	};

	const handleSubmit = async (
		close,
		avoidClosing = false,
		submittedRating = null,
	) => {
		const ratingToSubmit = submittedRating !== null ? submittedRating : rating;
		try {
			const response = await APIReview.sendFeedback({
				rating: ratingToSubmit,
				feedback,
			}).then(async (res) => {
				await save({
					ea11y_review_data: {
						...get.data.ea11y_review_data,
						rating: parseInt(ratingToSubmit),
						feedback: escapeHTML(feedback),
						submitted: true,
					},
				});

				return res;
			});

			if (ratingToSubmit && !feedback) {
				mixpanelService.sendEvent(mixpanelEvents.review.starSelected, {
					rating: parseInt(ratingToSubmit),
				});
			}

			if (feedback) {
				mixpanelService.sendEvent(mixpanelEvents.review.feedbackSubmitted, {
					feedback_text: escapeHTML(feedback),
					rating: parseInt(ratingToSubmit),
				});
			}

			if (!response?.success && parseInt(ratingToSubmit) < 4) {
				/**
				 * Show success message if the feedback was already submitted.
				 */
				successNotification(
					__('Feedback already submitted', 'pojo-accessibility'),
				);
			} else if (response?.success && parseInt(ratingToSubmit) < 4) {
				successNotification(
					__('Thank you for your feedback!', 'pojo-accessibility'),
				);
			}

			if (!avoidClosing) {
				await close();
			}

			return true;
		} catch (e) {
			errorNotification(__('Failed to submit!', 'pojo-accessibility'));
			return false;
		}
	};

	return (
		<SettingsContext.Provider
			value={{
				rating,
				setRating,
				feedback,
				setFeedback,
				currentPage,
				setCurrentPage,
				showNotification,
				setShowNotification,
				notificationMessage,
				setNotificationMessage,
				notificationType,
				setNotificationType,
				isOpened,
				setIsOpened,
				handleClose,
				handleSubmit,
				errorNotification,
				successNotification,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export default SettingsProvider;
