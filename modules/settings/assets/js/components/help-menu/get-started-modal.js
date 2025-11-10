import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogContentText from '@elementor/ui/DialogContentText';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import { useModal, useStorage } from '@ea11y/hooks';
import { AppLogo } from '@ea11y/icons';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { usePluginSettingsContext } from '../../contexts/plugin-settings';

const GetStartedModal = ({ manualOpen = false, onManualClose }) => {
	const { isOpen, open, close } = useModal(false);
	const { save } = useStorage();
	const pluginSettings = usePluginSettingsContext() || {};
	const {
		isConnected,
		closePostConnectModal,
		isUrlMismatch,
		closeOnboardingModal,
		closeGetStartedModal,
	} = pluginSettings;

	// Ensure modal is open when manualOpen is true, and close when manualOpen becomes false
	useEffect(() => {
		if (manualOpen && !isOpen) {
			open();
		} else if (!manualOpen && isOpen) {
			close();
		}
	}, [manualOpen, isOpen, open, close]);

	// Auto-open modal when conditions are met
	useEffect(() => {
		if (
			!manualOpen &&
			isConnected !== undefined &&
			closePostConnectModal !== undefined &&
			isUrlMismatch !== undefined &&
			closeOnboardingModal !== undefined &&
			closeGetStartedModal !== undefined &&
			isConnected &&
			closePostConnectModal &&
			!isUrlMismatch &&
			closeOnboardingModal &&
			!closeGetStartedModal &&
			!isOpen
		) {
			open();
		}
	}, [
		manualOpen,
		isConnected,
		closePostConnectModal,
		isUrlMismatch,
		closeOnboardingModal,
		closeGetStartedModal,
		isOpen,
		open,
	]);

	// Check if modal should be displayed
	// For manual open: bypass condition checks (only check isOpen)
	// For auto-open: check all conditions (with undefined checks)
	const shouldDisplayModal = manualOpen
		? isOpen
		: isOpen &&
			isConnected !== undefined &&
			closePostConnectModal !== undefined &&
			isUrlMismatch !== undefined &&
			closeOnboardingModal !== undefined &&
			closeGetStartedModal !== undefined &&
			isConnected &&
			closePostConnectModal &&
			!isUrlMismatch &&
			closeOnboardingModal &&
			!closeGetStartedModal;

	useEffect(() => {
		if (shouldDisplayModal && !manualOpen) {
			mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
				buttonName: 'Get started with Ally - Auto Opened',
			});
		}
	}, [shouldDisplayModal, manualOpen]);

	const handleClose = async () => {
		await save({
			ea11y_close_get_started_modal: true,
		});

		await mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: 'Get started with Ally - Modal Closed',
		});

		close();
		if (onManualClose) {
			onManualClose();
		}
	};

	// Prevent auto-open if modal was manually closed
	useEffect(() => {
		if (closeGetStartedModal && isOpen) {
			close();
		}
	}, [closeGetStartedModal, isOpen, close]);

	// Don't render if conditions aren't met (for auto-open)
	if (!manualOpen && !shouldDisplayModal) {
		return null;
	}

	return (
		<Dialog
			open={shouldDisplayModal}
			onClose={handleClose}
			aria-labelledby="get-started-dialog-title"
			aria-describedby="get-started-dialog-description"
		>
			<DialogHeader logo={<AppLogo />} onClose={handleClose}>
				<DialogTitle>{__('Ally', 'pojo-accessibility')}</DialogTitle>
			</DialogHeader>

			<DialogContent dividers>
				<iframe
					width="550"
					height="300"
					src="https://www.youtube.com/embed/4Ct_6HAsBr8?si=NZsWyvjBxvSs45lL&amp;controls=0"
					title="YouTube video player"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerPolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
				<DialogContentText variant="h5" color="text.primary" marginTop={2}>
					{__('Getting started with Ally', 'pojo-accessibility')}
				</DialogContentText>
				<DialogContentText variant="body1">
					{__(
						'Watch this quick video to see how Ally helps you find, understand, and fix accessibility issues across your site with ease.',
						'pojo-accessibility',
					)}
				</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleClose} color="info" variant="contained">
					{__('Got it', 'pojo-accessibility')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default GetStartedModal;
