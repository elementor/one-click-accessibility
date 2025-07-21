import RotateIcon from '@elementor/icons/RotateIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import InputAdornment from '@elementor/ui/InputAdornment';
import Slider from '@elementor/ui/Slider';
import TextField from '@elementor/ui/TextField';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { SunIcon, SunOffIcon } from '@ea11y-apps/scanner/images';
import { hexToHsl, hslToHex } from '@ea11y-apps/scanner/utils/convert-colors';

export const ColorSet = ({ title, color, initialColor, setColor }) => {
	const hslColor = hexToHsl(color);

	const resetColor = () => setColor(initialColor);

	const onChangeColor = (event) => {
		const raw = event.target.value;
		// Allow only digits
		if (raw && !/^\d{1,3}$/.test(raw)) {
			return;
		}

		const num = raw ? parseInt(raw, 10) : 0;
		if (num >= 0 && num <= 100) {
			const initialHslColor = hexToHsl(initialColor);
			const updatedColor = hslToHex({
				...initialHslColor,
				l: num,
			});
			setColor(updatedColor);
		}
	};

	return (
		<Box>
			<Typography variant="body2" as="h5">
				{title}
			</Typography>
			<StyledColorSet>
				<SunOffIcon />
				<Slider
					color="secondary"
					value={hslColor.l}
					size="small"
					sx={{ width: '150px' }}
					onChange={onChangeColor}
				/>
				<SunIcon />
				<TextField
					variant="outlined"
					size="small"
					value={hslColor.l}
					onChange={onChangeColor}
					InputProps={{
						sx: {
							width: '75px',
							paddingRight: '4px',
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
				<StyledColorDisplay sx={{ background: color }} />
				<IconButton onClick={resetColor} size="tiny">
					<RotateIcon
						ontSize="tiny"
						color="disabled"
						sx={{ transform: 'rotate(180deg)' }}
					/>
				</IconButton>
			</StyledColorSet>
		</Box>
	);
};

const StyledColorSet = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledColorDisplay = styled(Box)`
	box-sizing: border-box;
	width: ${({ theme }) => theme.spacing(5)};
	height: ${({ theme }) => theme.spacing(5)};
	border: 1px solid rgba(0, 0, 0, 0.23);
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
	margin-left: ${({ theme }) => theme.spacing(1)};
`;

ColorSet.propTypes = {
	title: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	initialColor: PropTypes.string.isRequired,
	setColor: PropTypes.func.isRequired,
};
