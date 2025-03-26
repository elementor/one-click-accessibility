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
import { eventNames, mixpanelService } from '@ea11y/services';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAnalyticsContext } from '../../contexts/analytics-context';

export const AnalyticsToggle = () => {
	const { isAnalyticsEnabled, updateIsAnalyticsEnabled } =
		useAnalyticsContext();
	const [showConfirm, setShowConfirm] = useState(false);

	const handleToggle = () => {
		if (isAnalyticsEnabled) {
			updateIsAnalyticsEnabled();
		} else {
			setShowConfirm(true);
		}

		mixpanelService.sendEvent(eventNames.toggleClicked, {
			state: isAnalyticsEnabled ? 'off' : 'on',
			type: 'Enable analytics',
		});
	};

	const handleClose = () => {
		setShowConfirm(false);

		mixpanelService.sendEvent(eventNames.popupButtonClicked, {
			data: {
				popupType: 'analytics_confirm',
				buttonName: 'Not now',
			},
		});
	};

	const handleConfirm = () => {
		updateIsAnalyticsEnabled();
		setShowConfirm(false);

		mixpanelService.sendEvent(eventNames.popupButtonClicked, {
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
						onChange={handleToggle}
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
				open={showConfirm}
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
