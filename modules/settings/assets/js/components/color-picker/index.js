import Box from '@elementor/ui/Box';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import Grid from '@elementor/ui/Grid';
import Typography from '@elementor/ui/Typography';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { useDebouncedCallback } from 'use-debounce';
import { useIconDesign } from '@ea11y/hooks';
import { eventNames, mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import './style.css';

const ColorPicker = () => {
	const { iconDesign, updateIconDesign } = useIconDesign();
	const debounced = useDebouncedCallback((value) => {
		mixpanelService.sendEvent(eventNames.colorChanged, {
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
					></Box>
					<HexColorInput
						aria-label={__('Color', 'pojo-accessibility')}
						color={iconDesign.color}
						onChange={(value) => {
							updateIconDesign({ color: value });
							debounced(value);
						}}
						style={{
							width: '100%',
							border: '1px solid rgba(0, 0, 0, 0.12)',
							borderRadius: '3px',
							paddingLeft: '10px',
						}}
					/>
				</Grid>
			</Grid>
		</FormControl>
	);
};

export default ColorPicker;
