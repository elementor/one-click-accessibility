import Box from '@elementor/ui/Box';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Switch from '@elementor/ui/Switch';
import Typography from '@elementor/ui/Typography';
import { AlignmentMatrixControl, PositionControl } from '@ea11y/components';
import { useIconPosition } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';

const PositionSettingsMobile = () => {
	const { iconPosition, updateIconPosition } = useIconPosition();

	const toggleVisibility = (device) => {
		updateIconPosition(device, 'hidden', !iconPosition[device].hidden);
	};

	const toggleExactPosition = (device) => {
		updateIconPosition(
			device,
			'enableExactPosition',
			!iconPosition[device].enableExactPosition,
		);
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
			/>
			{!iconPosition.mobile.hidden && (
				<Box
					display="grid"
					gridTemplateColumns="repeat(2,1fr)"
					gap={5}
					padding={2}
				>
					<AlignmentMatrixControl mode="mobile" />
					<Box>
						<FormControlLabel
							label={exactPositionLabel}
							labelPlacement="start"
							control={<Switch color="info" size="small" />}
							sx={{ marginLeft: 0 }}
							onChange={() => toggleExactPosition('mobile')}
						/>
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
				</Box>
			)}
		</>
	);
};

export default PositionSettingsMobile;
