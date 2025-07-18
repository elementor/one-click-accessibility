import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogContentText from '@elementor/ui/DialogContentText';
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
				<DialogContent>
					<Typography variant="h5" align="center" sx={{ mb: 3 }}>
						{__('Confirm widget data tracking', 'pojo-accessibility')}
					</Typography>
					<DialogContentText
						id="confirm-enable-analytics-description"
						align="center"
					>
						{__(
							'Enabling data tracking let’s you see how users interact with your widget and features. Keep in mind: Real-time data processing may slightly impact a site’s performance, especially on high-traffic websites.',
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
