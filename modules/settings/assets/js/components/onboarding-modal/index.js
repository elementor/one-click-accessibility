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

const OnboardingModal = () => {
	const { isOpen, close } = useModal();
	const { save } = useStorage();
	const { homeUrl } = usePluginSettingsContext();

	useEffect(() => {
		if (isOpen) {
			mixpanelService.sendEvent(mixpanelEvents.introductionBannerShowed);
		}
	}, [isOpen]);

	const onClose = async () => {
		await save({
			ea11y_close_onboarding_modal: true,
		});

		await mixpanelService.sendEvent(mixpanelEvents.introductionBannerClosed);

		close();
	};

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogHeader logo={<AppLogo />} onClose={onClose}>
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
					{__('See the upgraded assistant in action', 'pojo-accessibility')}
				</DialogContentText>
				<DialogContentText>
					{__(
						'Watch a short video to discover what’s new, then scan a page to see the improved issue detection and smarter solutions for a more accessible site.',
						'pojo-accessibility',
					)}
				</DialogContentText>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose} color="secondary">
					{__('Got it', 'pojo-accessibility')}
				</Button>
				<Button
					href={`${homeUrl}?open-ea11y-assistant=1&open-ea11y-assistant-src=Ally_dashboard`}
					target="_blank"
					variant="contained"
					color="info"
					onClick={() => {
						mixpanelService.sendEvent(mixpanelEvents.scanHomePageButtonClicked);
					}}
				>
					{__('Scan home page', 'pojo-accessibility')}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default OnboardingModal;
