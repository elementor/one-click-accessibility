import AIIcon from '@elementor/icons/AIIcon';
import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import AlertTitle from '@elementor/ui/AlertTitle';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Checkbox from '@elementor/ui/Checkbox';
import CircularProgress from '@elementor/ui/CircularProgress';
import Divider from '@elementor/ui/Divider';
import FormHelperText from '@elementor/ui/FormHelperText';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';

import InputAdornment from '@elementor/ui/InputAdornment';
import TextField from '@elementor/ui/TextField';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { ImagePreview } from '@ea11y-apps/scanner/components/alt-text-form/image-preview';
import { UpgradeContent } from '@ea11y-apps/scanner/components/upgrade-info-tip/upgrade-content';
import { AI_QUOTA_LIMIT, IS_AI_ENABLED } from '@ea11y-apps/scanner/constants';
import { useAltTextForm } from '@ea11y-apps/scanner/hooks/use-alt-text-form';
import { StyledLabel } from '@ea11y-apps/scanner/styles/alt-text-form.styles';
import { StyledAlert, StyledBox } from '@ea11y-apps/scanner/styles/app.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { __ } from '@wordpress/i18n';

export const AltTextForm = ({ items, current, setCurrent }) => {
	const { error } = useToastNotification();
	const {
		data,
		loadingAiText,
		isSubmitDisabled,
		loading,
		handleChange,
		handleCheck,
		handleSubmit,
		generateAltText,
	} = useAltTextForm({
		current,
		item: items[current],
	});

	const onSubmit = async () => {
		try {
			await handleSubmit();
			setCurrent(current + 1);
		} catch (e) {
			error(__('An error occurred.', 'pojo-accessibility'));
		}
	};

	const onUpgradeHover = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeSuggestionViewed, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			action_trigger: 'fix_with_ai',
			feature_locked: 'AI alt-text',
		});
	};

	return (
		<StyledBox>
			<Divider />

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
					aria-label={__(
						'Add or generate the description here',
						'pojo-accessibility',
					)}
					color="secondary"
					value={data?.[current]?.altText ?? ''}
					onChange={handleChange}
					fullWidth
					multiline
					disabled={loadingAiText}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								{IS_AI_ENABLED && AI_QUOTA_LIMIT ? (
									<Tooltip
										placement="top-end"
										title={__(
											'Generate an Alt text description with AI.',
											'pojo-accessibility',
										)}
										PopperProps={{
											disablePortal: true,
										}}
										slotProps={{
											tooltip: {
												sx: {
													maxWidth: '101px',
													whiteSpace: 'normal',
													lineHeight: 1.4,
												},
											},
										}}
									>
										<IconButton
											size="small"
											onClick={generateAltText}
											disabled={loadingAiText}
										>
											{loadingAiText ? (
												<CircularProgress color="info" size={24} />
											) : (
												<AIIcon color="info" />
											)}
										</IconButton>
									</Tooltip>
								) : (
									<Infotip
										placement="top-end"
										slotProps={{
											tooltip: {
												id: 'ai-btn-description',
											},
										}}
										PopperProps={{
											disablePortal: true,
										}}
										content={<UpgradeContent isAlt />}
									>
										<IconButton
											size="small"
											aria-labelledby="ai-btn-description"
											onHover={onUpgradeHover}
										>
											<AIIcon color="promotion" />
										</IconButton>
									</Infotip>
								)}
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
			<StyledAlert color="info" sx={{ p: 2 }} icon={false}>
				<Box>
					<AlertTitle sx={{ display: 'inline-block' }}>
						{__('Tips:', 'pojo-accessibility')}
					</AlertTitle>
					{__(
						"Keep descriptions short and simple, describing what the image shows or why it's on the page.",
						'pojo-accessibility',
					)}
				</Box>
			</StyledAlert>
			<Button
				variant="contained"
				color="info"
				fullWidth
				loading={loading}
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
