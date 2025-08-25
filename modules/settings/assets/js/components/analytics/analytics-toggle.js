import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogContentText from '@elementor/ui/DialogContentText';
import DialogHeader from '@elementor/ui/DialogHeader';
import DialogTitle from '@elementor/ui/DialogTitle';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Infotip from '@elementor/ui/Infotip';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const AnalyticsToggle = () => {
	const {
		isAnalyticsEnabled,
		handleAnalyticsToggle,
		updateIsAnalyticsEnabled,
		showConfirmPopup,
		setShowConfirmPopup,
	} = useAnalyticsContext();

	const handleToggleClick = () => {
		handleAnalyticsToggle();
	};

	const handleClose = () => {
		setShowConfirmPopup(false);

		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			data: {
				popupType: 'analytics_confirm',
				buttonName: 'Not now',
			},
		});
	};

	const handleConfirm = () => {
		updateIsAnalyticsEnabled();
		setShowConfirmPopup(false);

		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			data: {
				popupType: 'analytics_confirm',
				buttonName: 'Confirm',
			},
		});
	};

	return (
		<>
			<FormControlLabel
				control={
					<Switch
						color="info"
						checked={isAnalyticsEnabled}
						onChange={handleToggleClick}
						sx={{ ml: 2 }}
					/>
				}
				label={
					<Box display="flex" alignItems="center" gap={1}>
						<Typography variant="body1">
							{__('Track widget data', 'pojo-accessibility')}
						</Typography>

						<Infotip
							content={
								<Typography variant="body1" sx={{ p: 2, maxWidth: '300px' }}>
									{__(
										"Enable to track widget data, feature usage, user insights and more to improve your website's accessibility.",
										'pojo-accessibility',
									)}
								</Typography>
							}
						>
							<InfoCircleIcon fontSize="small" />
						</Infotip>
					</Box>
				}
				labelPlacement="start"
				sx={{ ml: 0 }}
			/>
			<Dialog
				open={showConfirmPopup}
				onClose={handleClose}
				aria-labelledby="confirm-enable-analytics-title"
				aria-describedby="confirm-enable-analytics-description"
			>
				<DialogHeader>
					<DialogTitle>
						{__('Enable widget tracking?', 'pojo-accessibility')}
					</DialogTitle>
				</DialogHeader>
				<DialogContent
					sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}
				>
					<DialogContentText id="confirm-enable-analytics-description">
						{__(
							'This allows Ally to record how visitors open and use your accessibility widget, unlocking real‑time analytics.',
							'pojo-accessibility',
						)}
					</DialogContentText>
					<DialogContentText id="confirm-enable-analytics-description">
						{__(
							'This may slightly affect performance on high‑traffic sites.',
							'pojo-accessibility',
						)}
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						{__('Not now', 'pojo-accessibility')}
					</Button>
					<Button onClick={handleConfirm} variant="contained" color="info">
						{__('Confirm & enable', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
