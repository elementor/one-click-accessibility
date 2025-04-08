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
import { __, sprintf } from '@wordpress/i18n';

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
		<FormControl
			id="icon-radius-controls-group"
			aria-label="Widget icon radius control"
			aria-describedby="Set corner radius for the icon from 0px to 32px using input or slider. Default corner radius value for icon is 32px and for text icon it is 8px."
			aria-labelledby="icon-radius-controls-group-label"
		>
			<FormLabel
				id="icon-radius-controls-group-label"
				color="secondary"
				aria-label="Widget icon radius control"
			>
				<Typography variant="subtitle2" marginBottom={1}>
					{__('Corner radius', 'pojo-accessibility')}
				</Typography>
			</FormLabel>
			<StyledBox>
				<StyledTextField
					name="icon radius input field"
					inputProps={{
						'aria-label': sprintf(
							// Translators: %s - units
							__(
								'Numbered input for corner radius in %s.',
								'pojo-accessibility',
							),
							units[unitsIndex],
						),
						'aria-describedby':
							'Set corner radius for the icon from 0px to 32px.',
						role: 'textbox',
						'aria-labelledby': 'icon-radius-controls-group-label',
					}}
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
									aria-label="Corner radius unit"
									aria-describedby="Select corner radius unit in pixels."
									role="button"
								>
									{units[unitsIndex]}
								</Button>

								<Menu
									MenuListProps={{ dense: true }}
									{...bindMenu(popupState)}
									aria-label="Select corner radius unit"
									role="menu"
									aria-disabled="true"
									aria-describedby="Corner radius unit is pixels."
								>
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
					name="icon radius slider"
					aria-label="Slider for corner radius"
					aria-describedby="Set corner radius for the icon from 0px to 32px."
					role="slider"
					aria-valuemin={0}
					aria-valuemax={32}
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
