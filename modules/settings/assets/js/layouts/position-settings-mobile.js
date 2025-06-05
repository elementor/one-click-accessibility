import Box from '@elementor/ui/Box';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import {
	AlignmentMatrixControl,
	PositionControl,
	PositionSettingsWrapper,
} from '@ea11y/components';
import { useIconPosition } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';

const PositionSettingsMobile = () => {
	const { iconPosition, updateIconPosition } = useIconPosition();

	const toggleVisibility = (device) => {
		updateIconPosition(device, 'hidden', !iconPosition[device].hidden);
		mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
			state: iconPosition[device].hidden ? 'on' : 'off',
			type: 'Hide on mobile',
			device,
		});
	};

	const toggleExactPosition = (device) => {
		updateIconPosition(
			device,
			'enableExactPosition',
			!iconPosition[device].enableExactPosition,
		);
		mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
			state: iconPosition[device].enableExactPosition ? 'on' : 'off',
			type: 'Exact position',
			device,
		});
	};

	const hideOnMobileLabel = (
		<Typography variant="subtitle2" color="text.primary" marginRight={2}>
			{__('Hide on mobile', 'pojo-accessibility')}
		</Typography>
	);

	const exactPositionLabel = (
		<Typography variant="subtitle2" color="text.primary" marginRight={2}>
			{__('Exact position', 'pojo-accessibility')}
		</Typography>
	);

	return (
		<>
			<FormControlLabel
				label={hideOnMobileLabel}
				labelPlacement="start"
				control={<Switch color="info" size="small" />}
				sx={{ marginLeft: 2, marginBottom: 3 }}
				onChange={() => toggleVisibility('mobile')}
				checked={iconPosition.mobile.hidden}
			/>
			{!iconPosition.mobile.hidden && (
				<PositionSettingsWrapper>
					<AlignmentMatrixControl mode="mobile" />
					<Box>
						<FormControlLabel
							label={exactPositionLabel}
							labelPlacement="start"
							control={<Switch color="info" size="small" />}
							sx={{ marginLeft: 0 }}
							onChange={() => toggleExactPosition('mobile')}
							checked={iconPosition.mobile?.enableExactPosition}
						/>
						<Typography
							id="ea11y-mobile-position-settings"
							variant="body2"
							sx={{ marginTop: 2, marginBottom: 1 }}
						>
							{__(
								'Exact positioning, 5 – 500 px are permitted values:',
								'pojo-accessibility',
							)}
						</Typography>
						<PositionControl
							type="horizontal"
							mode="mobile"
							disabled={!iconPosition.mobile?.enableExactPosition}
						/>
						<PositionControl
							type="vertical"
							mode="mobile"
							disabled={!iconPosition.mobile?.enableExactPosition}
						/>
					</Box>
				</PositionSettingsWrapper>
			)}
		</>
	);
};

export default PositionSettingsMobile;
