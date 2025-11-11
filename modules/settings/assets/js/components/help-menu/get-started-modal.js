import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogContentText from '@elementor/ui/DialogContentText';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import { useSettings, useStorage } from '@ea11y/hooks';
import { AppLogo } from '@ea11y/icons';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { usePluginSettingsContext } from '../../contexts/plugin-settings';

const GetStartedModal = () => {
	const { save } = useStorage();
	const { isGetStartedModalOpen, setIsGetStartedModalOpen } = useSettings();
	const {
		isConnected,
		closePostConnectModal,
		isUrlMismatch,
		closeOnboardingModal,
		closeGetStartedModal,
	} = usePluginSettingsContext();

	useEffect(() => {
		if (
			isConnected &&
			closePostConnectModal &&
			!isUrlMismatch &&
			closeOnboardingModal &&
			!closeGetStartedModal &&
			!isGetStartedModalOpen
		) {
			setIsGetStartedModalOpen(true);
		}
	}, [
		isConnected,
		closePostConnectModal,
		isUrlMismatch,
		closeOnboardingModal,
		closeGetStartedModal,
	]);

	const handleClose = () => {
		setIsGetStartedModalOpen(false);

		save({
			ea11y_close_get_started_modal: true,
		}).catch((error) => {
			console.error('Failed to save get started modal state:', error);
		});

		mixpanelService
			.sendEvent(mixpanelEvents.menuButtonClicked, {
				buttonName: 'Get started with Ally - Modal Closed',
			})
			.catch((error) => {
				console.error('Failed to send mixpanel event:', error);
			});
	};

	return (
		<Dialog
			open={isGetStartedModalOpen}
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
					height="309"
					src="https://www.youtube.com/embed/1D9UfHJD8cE?si=0txuUSHwaXlu22BZ&amp;controls=0"
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
