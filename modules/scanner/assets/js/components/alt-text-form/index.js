import AIIcon from '@elementor/icons/AIIcon';
import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Checkbox from '@elementor/ui/Checkbox';
import FormHelperText from '@elementor/ui/FormHelperText';
import IconButton from '@elementor/ui/IconButton';

import InputAdornment from '@elementor/ui/InputAdornment';
import TextField from '@elementor/ui/TextField';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { ImagePreview } from '@ea11y-apps/scanner/components/image-preview';
import { useAltTextForm } from '@ea11y-apps/scanner/hooks/useAltTextForm';
import {
	StyledAlert,
	StyledBox,
	StyledLabel,
} from '@ea11y-apps/scanner/styles/alt-text-form.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { __ } from '@wordpress/i18n';

export const AltTextForm = ({ items, current, setCurrent }) => {
	const { data, isSubmitDisabled, handleChange, handleCheck, handleSubmit } =
		useAltTextForm({
			current,
			item: items[current],
		});

	const onSubmit = async () => {
		await handleSubmit();
		setCurrent(current + 1);
	};

	return (
		<StyledBox>
			<StyledAlert color="info" icon={<InfoCircleIcon color="info" />}>
				{__(
					'Short description will help those who cannot see it.',
					'pojo-accessibility',
				)}
			</StyledAlert>

			<ImagePreview element={items[current].node} />

			<StyledLabel>
				<Checkbox
					checked={data?.[current]?.makeDecorative ?? false}
					color="info"
					sx={{ margin: '-7px 0 0 -10px' }}
					size="small"
					onChange={handleCheck}
				/>
				<Box>
					<Typography variant="body1">
						{__('Mark image as decorative', 'pojo-accessibility')}
					</Typography>
					<FormHelperText sx={{ mt: 0 }}>
						{__(
							"(decorative images don't need description)",
							'pojo-accessibility',
						)}
					</FormHelperText>
				</Box>
			</StyledLabel>
			{!data?.[current]?.makeDecorative ? (
				<TextField
					placeholder={__(
						'Add or generate the description here',
						'pojo-accessibility',
					)}
					color="secondary"
					value={data?.[current]?.altText ?? ''}
					onChange={handleChange}
					fullWidth
					multiline
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Tooltip
									title={__(
										'Generate an Alt text description with AI.',
										'pojo-accessibility',
									)}
									PopperProps={{
										disablePortal: true,
									}}
									componentsProps={{
										tooltip: {
											sx: {
												maxWidth: '101px',
												whiteSpace: 'normal',
												lineHeight: 1.4,
											},
										},
									}}
								>
									<IconButton size="small">
										<AIIcon color="info" />
									</IconButton>
								</Tooltip>
							</InputAdornment>
						),
					}}
				/>
			) : (
				<Box display="flex" gap={1}>
					<CircleCheckFilledIcon color="success" />
					<Typography variant="body1">
						{__('no description needed', 'pojo-accessibility')}
					</Typography>
				</Box>
			)}
			<Button
				variant="contained"
				color="info"
				fullWidth
				disabled={isSubmitDisabled}
				onClick={onSubmit}
			>
				{__('Resolve', 'pojo-accessibility')}
			</Button>
		</StyledBox>
	);
};

AltTextForm.propTypes = {
	items: PropTypes.arrayOf(scannerItem).isRequired,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
};
