import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import InputAdornment from '@elementor/ui/InputAdornment';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Select from '@elementor/ui/Select';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { useIconPosition } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const units = ['PX', 'REM', 'EM'];

const horizontalOptions = [
	{ value: 'left', label: __('To the left', 'pojo-accessibility') },
	{ value: 'right', label: __('To the right', 'pojo-accessibility') },
];

const verticalOptions = [
	{ value: 'top', label: __('Higher', 'pojo-accessibility') },
	{ value: 'bottom', label: __('Lower', 'pojo-accessibility') },
];

const StyledContainer = styled(Box)`
	display: flex;
	gap: ${({ theme }) => theme.spacing(1)};
	margin-top: ${({ theme }) => theme.spacing(2)};
	margin-bottom: ${({ theme, isError }) =>
		isError ? theme.spacing(4) : 'initial'};

	transition: all 100ms ease-in-out;
`;

const StyledTextField = styled(TextField)`
	width: 200px;
	height: 56px;

	.wp-admin & .MuiInputBase-input,
	& .MuiInputBase-input:focus {
		height: 56px;
		background-color: initial;
		box-shadow: none;
		border: 0;
		color: inherit;
		outline: 0;
		padding: 16.5px 14px 16.5px 14px;

		&.MuiInputBase-inputSizeSmall {
			padding: 8.5px 14px 8.5px 14px;
		}
	}
`;

const PositionControl = ({ type, disabled, mode }) => {
	const { iconPosition, updateExactPosition } = useIconPosition();
	const [unitsIndex, setUnitsIndex] = useState(0);
	const [inputValue, setInputValue] = useState(
		iconPosition[mode]?.exactPosition[type]?.value,
	);
	const [isValid, setIsValid] = useState(inputValue >= 5 && inputValue <= 550);
	const popupState = usePopupState({
		variant: 'popover',
		popupId: 'position-settings',
	});

	const handleMenuItemClick = (index) => {
		setUnitsIndex(index);

		updateExactPosition(
			mode,
			type,
			iconPosition[mode]?.exactPosition[type]?.direction,
			iconPosition[mode]?.exactPosition[type]?.value,
			units[index],
		);

		popupState.close();

		mixpanelService.sendEvent(mixpanelEvents.handleUnitChanged, {
			positionData: {
				mode,
				type,
				unit: units[index],
				value: iconPosition[mode]?.exactPosition[type]?.direction,
				direction: iconPosition[mode]?.exactPosition[type]?.value,
			},
		});
	};

	const handlePositionChange = (event) => {
		const value = parseInt(event.target.value, 10) || 0;
		const valueIsValid = value >= 5 && value <= 550;

		setInputValue(event.target.value);
		setIsValid(valueIsValid);

		if (valueIsValid) {
			updateExactPosition(
				mode,
				type,
				iconPosition[mode]?.exactPosition[type]?.direction,
				value,
				iconPosition[mode]?.exactPosition[type]?.unit,
			);

			mixpanelService.sendEvent(mixpanelEvents.handleValueChanged, {
				positionData: {
					mode,
					type,
					value,
					unit: iconPosition[mode]?.exactPosition[type]?.unit,
					direction: iconPosition[mode]?.exactPosition[type]?.value,
				},
			});
		}
	};

	const handlePositionDirection = (event) => {
		updateExactPosition(
			mode,
			type,
			event.target.value,
			iconPosition[mode]?.exactPosition[type]?.value,
			iconPosition[mode]?.exactPosition[type]?.unit,
		);

		mixpanelService.sendEvent(mixpanelEvents.handleDirectionChanged, {
			positionData: {
				mode,
				type,
				value: iconPosition[mode]?.exactPosition[type]?.value,
				unit: iconPosition[mode]?.exactPosition[type]?.unit,
				direction: event.target.value,
			},
		});
	};

	return (
		<StyledContainer
			isError={!isValid}
			role="group"
			aria-label={sprintf(
				// Translators: %1$s - date, %2$s - time
				__('%1$s icon %2$s settings', 'pojo-accessibility'),
				mode,
				type,
			)}
		>
			<StyledTextField
				size="medium"
				color="info"
				error={!isValid}
				helperText={!isValid ? 'Invalid value' : ''}
				disabled={disabled}
				value={inputValue}
				onChange={handlePositionChange}
				inputProps={{
					'aria-label': sprintf(
						// Translators: %s - units
						__('Number of %s', 'pojo-accessibility'),
						units[unitsIndex],
					),
					'aria-describedby': `ea11y-${mode}-position-settings`,
				}}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<Button
								size="small"
								color="inherit"
								sx={{ font: 'inherit', minWidth: 'initial' }}
								{...bindTrigger(popupState)}
								disabled={disabled}
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
			/>

			<Select
				fullWidth
				color="info"
				name={__('Direction', 'pojo-accessibility')}
				variant="outlined"
				onChange={handlePositionDirection}
				disabled={disabled}
				value={iconPosition[mode]?.exactPosition?.[type].direction}
				MenuProps={{
					MenuListProps: {
						sx: {
							minWidth: 150,
						},
					},
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left',
					},
					transformOrigin: {
						vertical: 'top',
						horizontal: 'left',
					},
				}}
			>
				{type === 'horizontal'
					? horizontalOptions.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))
					: verticalOptions.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
			</Select>
		</StyledContainer>
	);
};

export default PositionControl;
