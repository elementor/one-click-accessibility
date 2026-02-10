import AIIcon from '@elementor/icons/AIIcon';
import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardContent from '@elementor/ui/CardContent';
import Checkbox from '@elementor/ui/Checkbox';
import Chip from '@elementor/ui/Chip';
import CircularProgress from '@elementor/ui/CircularProgress';
import FormControlLabel from '@elementor/ui/FormControlLabel';
import Grid from '@elementor/ui/Grid';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import InputAdornment from '@elementor/ui/InputAdornment';
import Radio from '@elementor/ui/Radio';
import TextField from '@elementor/ui/TextField';
import Tooltip from '@elementor/ui/Tooltip';
import PropTypes from 'prop-types';
import { mixpanelService, mixpanelEvents } from '@ea11y-apps/global/services';
import { ImagePreview } from '@ea11y-apps/scanner/components/alt-text-form/image-preview';
import { UpgradeContent } from '@ea11y-apps/scanner/components/upgrade-info-tip/upgrade-content';
import { IS_PRO_PLAN, AI_QUOTA_LIMIT } from '@ea11y-apps/scanner/constants';
import { useAltTextForm } from '@ea11y-apps/scanner/hooks/use-alt-text-form';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const ImageCard = ({ item, current }) => {
	const {
		data,
		loadingAiText,
		handleChange,
		handleCheck,
		handleSave,
		handleCancel,
		generateAltText,
		updateData,
	} = useAltTextForm({
		current,
		item,
	});

	const onUpgradeHover = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeSuggestionViewed, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			action_trigger: 'fix_with_ai',
			feature_locked: 'AI alt-text',
		});
	};

	const handleRadioClick = () => {
		updateData({
			selected: !data?.[current]?.selected,
		});
	};

	return (
		<Card elevation={0} variant="outlined">
			<CardContent sx={{ padding: 0 }}>
				<Grid
					container
					padding={4}
					justifyContent="center"
					bgcolor="action.hover"
				>
					<Radio
						checked={data?.[current]?.selected ?? false}
						checkedIcon={<CircleCheckFilledIcon />}
						sx={{ position: 'absolute', top: 4, right: 4 }}
						color={
							data?.[current]?.selected && data?.[current]?.hasValidAltText
								? 'success'
								: 'info'
						}
						onClick={handleRadioClick}
					/>
					<ImagePreview element={item.node} />
				</Grid>
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
						sx={{
							'& fieldset': {
								padding: 2,
								border: 'none',
							},
						}}
						value={data?.[current]?.altText ?? ''}
						onChange={handleChange}
						fullWidth
						multiline
						disabled={loadingAiText}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									{IS_PRO_PLAN && AI_QUOTA_LIMIT ? (
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
					<Chip
						color="success"
						label={__('No description needed', 'pojo-accessibility')}
						icon={<InfoCircleIcon />}
						variant="standard"
						sx={{ margin: 2 }}
					/>
				)}
				{data?.[current]?.isDraft && !data?.[current]?.makeDecorative && (
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							gap: 1,
							paddingX: 2,
							paddingBottom: 2,
						}}
					>
						<Button
							size="small"
							variant="text"
							color="secondary"
							onClick={handleCancel}
						>
							{__('Cancel', 'pojo-accessibility')}
						</Button>
						<Button
							size="small"
							variant="contained"
							color="info"
							onClick={handleSave}
							disabled={!data?.[current]?.altText?.trim()}
						>
							{__('Save', 'pojo-accessibility')}
						</Button>
					</Box>
				)}
				<FormControlLabel
					sx={{ padding: 2 }}
					control={
						<Checkbox
							color="secondary"
							checked={data?.[current]?.makeDecorative ?? false}
						/>
					}
					label={__('Mark as decorative', 'pojo-accessibility')}
					onChange={handleCheck}
				/>
			</CardContent>
		</Card>
	);
};

ImageCard.propTypes = {
	item: PropTypes.object.isRequired,
	current: PropTypes.number.isRequired,
};

export default memo(ImageCard);
