import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import FormControl from '@elementor/ui/FormControl';
import FormLabel from '@elementor/ui/FormLabel';
import InputAdornment from '@elementor/ui/InputAdornment';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Slider from '@elementor/ui/Slider';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	usePopupState,
	bindTrigger,
	bindMenu,
} from '@elementor/ui/usePopupState';
import { useIconDesign } from '@ea11y/hooks';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const units = ['PX', 'REM', 'EM'];

const IconRadius = () => {
	const { iconDesign, updateIconDesign } = useIconDesign();
	const [unitsIndex, setUnitsIndex] = useState(0);
	const popupState = usePopupState({
		variant: 'popover',
		popupId: 'textfield-inner-selection',
	});

	const handleMenuItemClick = (index) => {
		setUnitsIndex(index);
		popupState.close();
	};

	const handleChange = (event) => {
		console.log(units[unitsIndex].toLowerCase());
		updateIconDesign({
			cornerRadius: {
				radius: event.target.value,
				unit: units[unitsIndex].toLowerCase(),
			},
		});
	};
	return (
		<FormControl>
			<FormLabel id="icon-size-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={1}>
					{__('Corner radius', 'pojo-accessibility')}
				</Typography>
			</FormLabel>
			<Box display="flex" flexDirection="row" alignItems="center" gap={2}>
				<StyledTextField
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Button
									size="small"
									color="inherit"
									sx={{ font: 'inherit', minWidth: 'initial' }}
									{...bindTrigger(popupState)}
								>
									{units[unitsIndex]}
								</Button>

								<Menu MenuListProps={{ dense: true }} {...bindMenu(popupState)}>
									{units.map((unit, index) => (
										<MenuItem
											key={unit}
											onClick={() => handleMenuItemClick(index)}
										>
											{unit}
										</MenuItem>
									))}
								</Menu>
							</InputAdornment>
						),
					}}
					onChange={handleChange}
					type="number"
					value={iconDesign?.cornerRadius?.radius || 0}
				/>
				<Slider
					color="info"
					defaultValue={50}
					onChange={handleChange}
					value={iconDesign?.cornerRadius?.radius || 0}
					min={0}
					max={100}
				/>
			</Box>
		</FormControl>
	);
};

export default IconRadius;

// Customization for the WP admin global CSS.
const StyledTextField = styled(TextField)`
	width: 180px;
	.wp-admin & .MuiInputBase-input,
	& .MuiInputBase-input:focus {
		background-color: initial;
		box-shadow: none;
		border: 0;
		color: inherit;
		outline: 0;
		padding: 16.5px 14px 16.5px 14px;
		&.MuiInputBase-inputSizeSmall {
			padding: 8.5px 14px 8.5px 14px;
		}
		height: 60px;
	}
`;
