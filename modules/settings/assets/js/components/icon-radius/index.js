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
import { eventNames, mixpanelService } from '@ea11y/services';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const units = ['PX', '%'];

const marks = [
	{
		value: 0,
		label: '0',
	},
	{
		value: 32,
		label: '32',
	},
];

const IconRadius = () => {
	const { iconDesign, updateIconDesign } = useIconDesign();
	const [unitsIndex, setUnitsIndex] = useState(0);

	useEffect(() => {
		// Run only if cornerRadius is not saved & is not set.
		if (
			(iconDesign?.cornerRadius?.radius ||
				iconDesign?.cornerRadius?.radius === 0) &&
			window?.ea11yWidget?.iconSettings?.style?.cornerRadius
		) {
			return;
		}

		const radius = iconDesign?.icon === 'text' ? 8 : 32;

		updateIconDesign({
			cornerRadius: {
				radius,
				unit: units[unitsIndex].toLowerCase(),
			},
		});
	}, [iconDesign?.icon]);

	const popupState = usePopupState({
		variant: 'popover',
		popupId: 'textfield-inner-selection',
	});

	const handleMenuItemClick = (index) => {
		setUnitsIndex(index);
		popupState.close();
	};

	const handleChange = (event, source, currentValue) => {
		updateIconDesign({
			cornerRadius: {
				radius: event.target.value,
				unit: units[unitsIndex].toLowerCase(),
			},
		});

		mixpanelService.sendEvent(eventNames.radiusChanged, {
			previous_radius_value: parseInt(currentValue),
			new_radius_value: parseInt(event.target.value),
			interaction_type: source,
		});
	};
	return (
		<FormControl>
			<FormLabel id="icon-size-radio-buttons-group-label" color="secondary">
				<Typography variant="subtitle2" marginBottom={1}>
					{__('Corner radius', 'pojo-accessibility')}
				</Typography>
			</FormLabel>
			<StyledBox>
				<StyledTextField
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Button
									size="small"
									color="inherit"
									sx={{
										font: 'inherit',
										minWidth: 'initial',
										width: '15px',
										fontSize: '14px',
									}}
									{...bindTrigger(popupState)}
									disabled
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
					onChange={(e) =>
						handleChange(e, 'input', iconDesign?.cornerRadius?.radius)
					}
					value={iconDesign?.cornerRadius?.radius || 0}
				/>
				<Slider
					color="info"
					onChange={(e) =>
						handleChange(e, 'slider', iconDesign?.cornerRadius?.radius)
					}
					value={iconDesign?.cornerRadius?.radius || 0}
					min={0}
					max={32}
					marks={marks}
				/>
			</StyledBox>
		</FormControl>
	);
};

export default IconRadius;

// Customization for the WP admin global CSS.
const StyledTextField = styled(TextField)`
	width: 105px;
	.wp-admin & .MuiInputBase-input,
	& .MuiInputBase-input:focus {
		background-color: initial;
		box-shadow: none;
		border: 0;
		color: inherit;
		outline: 0;
		padding: 10px 10px 10px 10px;
		&.MuiInputBase-inputSizeSmall {
			padding: 8.5px 8px 8.5px 8px;
		}
		height: 60px;
	}
`;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(4)};
`;
