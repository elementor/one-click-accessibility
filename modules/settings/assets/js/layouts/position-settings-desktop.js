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

const PositionSettingsDesktop = () => {
	const { iconPosition, updateIconPosition } = useIconPosition();

	const toggleVisibility = (device) => {
		updateIconPosition(device, 'hidden', !iconPosition[device].hidden);

		mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
			state: iconPosition[device].hidden ? 'on' : 'off',
			type: 'Hide on desktop',
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

	const hideOnDesktopLabel = (
		<Typography variant="subtitle2" marginInlineEnd={2} color="text.primary">
			{__('Hide on desktop', 'pojo-accessibility')}
		</Typography>
	);

	const exactPositionLabel = (
		<Typography variant="subtitle2" color="text.primary" marginInlineEnd={2}>
			{__('Exact position', 'pojo-accessibility')}
		</Typography>
	);

	return (
		<>
			<FormControlLabel
				label={hideOnDesktopLabel}
				labelPlacement="start"
				control={<Switch color="info" size="small" />}
				sx={{ marginInlineStart: 2, marginBlockEnd: 3 }}
				onChange={() => toggleVisibility('desktop')}
				checked={iconPosition.desktop.hidden}
			/>
			{!iconPosition.desktop.hidden && (
				<PositionSettingsWrapper>
					<AlignmentMatrixControl mode="desktop" />

					<Box>
						<FormControlLabel
							label={exactPositionLabel}
							labelPlacement="start"
							control={<Switch color="info" size="small" />}
							sx={{ marginInlineStart: 0 }}
							onChange={() => toggleExactPosition('desktop')}
							checked={iconPosition.desktop?.enableExactPosition}
						/>

						<Typography
							id="ea11y-desktop-position-settings"
							variant="body2"
							sx={{ marginBlockStart: 2, marginBlockEnd: 1 }}
						>
							{__(
								'Exact positioning, 5 – 500 px are permitted values:',
								'pojo-accessibility',
							)}
						</Typography>

						<PositionControl
							type="horizontal"
							mode="desktop"
							disabled={!iconPosition.desktop?.enableExactPosition}
						/>

						<PositionControl
							type="vertical"
							mode="desktop"
							disabled={!iconPosition.desktop?.enableExactPosition}
						/>
					</Box>
				</PositionSettingsWrapper>
			)}
		</>
	);
};

export default PositionSettingsDesktop;
