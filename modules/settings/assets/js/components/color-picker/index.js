import Box from '@elementor/ui/Box';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { useDebouncedCallback } from 'use-debounce';
import { useIconDesign } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import './style.css';

const StyledHexColorInput = styled(HexColorInput)`
	width: 100%;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 3px;
	padding-left: 10px;
`;

const ColorPicker = () => {
	const { iconDesign, updateIconDesign } = useIconDesign();

	const debounced = useDebouncedCallback((value) => {
		mixpanelService.sendEvent(mixpanelEvents.colorChanged, {
			color: value,
		});
	}, 1000);

	return (
		<FormControl fullWidth>
			<FormLabel id="color-picker-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={1} color="text.primary">
					{__('Color', 'pojo-accessibility')}
				</Typography>
			</FormLabel>

			<Grid padding={1} border={1} borderColor="divider" borderRadius={1}>
				<HexColorPicker
					color={iconDesign.color}
					onChange={(value) => {
						updateIconDesign({ color: value });
						debounced(value);
					}}
					className="widget-settings-color-picker"
				/>

				<Grid marginTop={2} display="flex">
					<Box
						padding={2}
						sx={{ backgroundColor: iconDesign.color }}
						borderRadius={1}
						marginRight={1}
					/>

					<StyledHexColorInput
						aria-label={__('HEX color code', 'pojo-accessibility')}
						aria-description={__(
							'Provide the HEX code here without a leading hash sign',
							'pojo-accessibility',
						)}
						color={iconDesign.color}
						onChange={(value) => {
							updateIconDesign({ color: value });

							debounced(value);
						}}
					/>
				</Grid>
			</Grid>
		</FormControl>
	);
};

export default ColorPicker;
