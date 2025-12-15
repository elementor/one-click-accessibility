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
import { SetGlobal } from '@ea11y-apps/scanner/components/manage-footer-actions/page/set-global';
import { UpgradeContent } from '@ea11y-apps/scanner/components/upgrade-info-tip/upgrade-content';
import { AI_QUOTA_LIMIT, IS_PRO_PLAN } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useAltTextForm } from '@ea11y-apps/scanner/hooks/use-alt-text-form';
import { StyledLabel } from '@ea11y-apps/scanner/styles/alt-text-form.styles';
import { StyledAlert, StyledBox } from '@ea11y-apps/scanner/styles/app.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { __ } from '@wordpress/i18n';

export const AltTextForm = ({ item, current, setCurrent, setIsEdit }) => {
	const { isManage } = useScannerWizardContext();
	const { error } = useToastNotification();
	const {
		isGlobal,
		setIsGlobal,
		data,
		loadingAiText,
		isSubmitDisabled,
		loading,
		handleChange,
		handleCheck,
		handleSubmit,
		handleUpdate,
		generateAltText,
	} = useAltTextForm({
		current,
		item,
	});

	const onGlobalChange = (value) => {
		setIsGlobal(value);
	};

	const onCancel = () => {
		setIsEdit(false);
	};

	const onSubmit = async () => {
		try {
			await handleSubmit();
			setCurrent(current + 1);
		} catch (e) {
			error(__('An error occurred.', 'pojo-accessibility'));
		}
	};

	const onUpdate = async () => {
		await handleUpdate();
		void (setIsEdit ? setIsEdit(false) : setCurrent(current + 1));
	};

	const onUpgradeHover = () => {
		mixpanelService.sendEvent(mixpanelEvents.upgradeSuggestionViewed, {
			current_plan: window.ea11yScannerData?.planData?.plan?.name,
			action_trigger: 'fix_with_ai',
			feature_locked: 'AI alt-text',
		});
	};

	const applyBtnText = isManage
		? __('Apply changes', 'pojo-accessibility')
		: __('Apply fix', 'pojo-accessibility');

	return (
		<StyledBox>
			<Divider />

			<ImagePreview element={item.node} />

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
			<Box>
				{!isManage && (
					<SetGlobal
						item={item}
						onGlobalChange={onGlobalChange}
						isChecked={isGlobal}
					/>
				)}

				<Box display="flex" gap={1} justifyContent="flex-end">
					{isManage && (
						<Button color="secondary" variant="text" onClick={onCancel}>
							{__('Cancel', 'pojo-accessibility')}
						</Button>
					)}
					<Button
						variant="contained"
						color="info"
						fullWidth={!isManage}
						loading={loading}
						disabled={isSubmitDisabled}
						onClick={
							isManage || data?.[current]?.resolved ? onUpdate : onSubmit
						}
						sx={{ mt: isManage ? 0 : 1.5 }}
					>
						{isGlobal ? __('Apply to all', 'pojo-accessibility') : applyBtnText}
					</Button>
				</Box>
			</Box>
		</StyledBox>
	);
};

AltTextForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
	setCurrent: PropTypes.func.isRequired,
	setIsEdit: PropTypes.func,
};
