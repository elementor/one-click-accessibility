import RotateIcon from '@elementor/icons/RotateIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import InputAdornment from '@elementor/ui/InputAdornment';
import Slider from '@elementor/ui/Slider';
import TextField from '@elementor/ui/TextField';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { UnstableColorPicker } from '@elementor/ui/unstable';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { SunIcon, SunOffIcon } from '@ea11y-apps/scanner/images';
import { hexToHsl, hslToHex } from '@ea11y-apps/scanner/utils/convert-colors';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ColorSet = ({ title, color, initialColor, setColor, area }) => {
	const [selectedColor, setSelectedColor] = useState(initialColor);
	const hslColor = hexToHsl(color);

	useEffect(() => {
		setSelectedColor(initialColor);
	}, [initialColor]);

	const sendEvent = (component, event = null) => {
		mixpanelService.sendEvent(event ?? mixpanelEvents.contrastColorChanged, {
			area,
			component,
		});
	};

	const resetColor = () => {
		setColor(initialColor);
		sendEvent('reset', mixpanelEvents.contrastResetClicked);
	};

	const onColorChange = (changedColor) => {
		setSelectedColor(changedColor);
		setColor(changedColor);
		sendEvent('color-picker');
	};

	const onLightnessChange = (event, value) => {
		const raw = event?.target?.value || value;
		// Allow only digits
		if (raw && !/^\d{1,2}$|^100$/.test(raw)) {
			return;
		}

		const num = raw && !isNaN(raw) ? parseInt(raw, 10) : 0;

		if (num >= 0 && num <= 100) {
			const initialHslColor = hexToHsl(selectedColor);
			const updatedColor = hslToHex({
				...initialHslColor,
				l: num,
			});
			setColor(updatedColor);
			sendEvent('slider');
		}
	};

	return (
		<Box>
			<Typography variant="body2" as="p">
				{title}
			</Typography>
			<StyledColorSet>
				<SunOffIcon />
				<Slider
					aria-label={__('Lightness', 'pojo-accessibility')}
					color="secondary"
					value={hslColor.l}
					size="small"
					sx={{ width: '150px' }}
					onChange={onLightnessChange}
				/>
				<SunIcon />
				<TextField
					variant="outlined"
					size="small"
					color="secondary"
					value={hslColor.l}
					onChange={onLightnessChange}
					inputProps={{
						'aria-label': __('Lightness percent', 'pojo-accessibility'),
					}}
					InputProps={{
						sx: {
							width: '75px',
							paddingRight: '4px',
							marginRight: '8px',
						},
						endAdornment: (
							<InputAdornment position="end">
								<Button size="small" disabled sx={{ minWidth: 'auto' }}>
									%
								</Button>
							</InputAdornment>
						),
					}}
				/>
				<UnstableColorPicker
					disableOpacity
					formats={['hex']}
					value={color}
					onChange={onColorChange}
					size="small"
				/>
				<Tooltip
					arrow
					placement="top"
					title={__('Reset', 'pojo-accessibility')}
					PopperProps={{
						disablePortal: true,
					}}
				>
					{color !== initialColor ? (
						<IconButton onClick={resetColor} size="tiny">
							<RotateIcon
								fontSize="tiny"
								sx={{ transform: 'rotate(180deg)' }}
							/>
						</IconButton>
					) : (
						<RotateIcon
							color="disabled"
							fontSize="tiny"
							sx={{ p: '6px', transform: 'rotate(180deg)' }}
						/>
					)}
				</Tooltip>
			</StyledColorSet>
		</Box>
	);
};

const StyledColorSet = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1)};
`;

ColorSet.propTypes = {
	title: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	initialColor: PropTypes.string.isRequired,
	setColor: PropTypes.func.isRequired,
	area: PropTypes.string.isRequired,
};
