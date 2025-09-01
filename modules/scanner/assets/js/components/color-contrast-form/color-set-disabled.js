import LockFilledIcon from '@elementor/icons/LockFilledIcon';
import RotateIcon from '@elementor/icons/RotateIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import InputAdornment from '@elementor/ui/InputAdornment';
import Slider from '@elementor/ui/Slider';
import TextField from '@elementor/ui/TextField';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { UnstableColorIndicator } from '@elementor/ui/unstable';
import PropTypes from 'prop-types';
import { SunIcon, SunOffIcon } from '@ea11y-apps/scanner/images';
import { __ } from '@wordpress/i18n';

export const ColorSetDisabled = ({ title, description }) => {
	return (
		<Box>
			<Box display="flex" alignItems="center" gap={1}>
				<Typography variant="body2" as="p" color="text.disabled">
					{title}
				</Typography>
				<Tooltip
					arrow
					placement="top"
					title={description}
					PopperProps={{
						disablePortal: true,
						sx: {
							'& .MuiTooltip-tooltip': {
								maxWidth: 400,
							},
						},
					}}
				>
					<LockFilledIcon tabindex={0} color="disabled" fontSize="tiny" />
				</Tooltip>
			</Box>
			<StyledColorSet>
				<SunOffIcon />
				<Slider
					aria-label={__('Lightness', 'pojo-accessibility')}
					color="secondary"
					size="small"
					sx={{ width: '150px' }}
					disabled
				/>
				<SunIcon />
				<TextField
					variant="outlined"
					size="small"
					color="secondary"
					defaultValue="-"
					disabled
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
				<UnstableColorIndicator
					value="rgba(0, 0, 0, 0)"
					disabled
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
					<RotateIcon
						color="disabled"
						fontSize="tiny"
						sx={{ p: '6px', transform: 'rotate(180deg)' }}
					/>
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

ColorSetDisabled.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
};
