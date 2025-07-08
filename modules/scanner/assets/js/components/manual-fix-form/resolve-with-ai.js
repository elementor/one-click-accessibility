import AIIcon from '@elementor/icons/AIIcon';
import CopyIcon from '@elementor/icons/CopyIcon';
import EditIcon from '@elementor/icons/EditIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import IconButton from '@elementor/ui/IconButton';
import Infotip from '@elementor/ui/Infotip';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { UpgradeInfoTip } from '@ea11y-apps/scanner/components/upgrade-info-tip';
import {
	AI_QUOTA_LIMIT,
	BLOCK_TITLES,
	IS_AI_ENABLED,
} from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useCopyToClipboard } from '@ea11y-apps/scanner/hooks/use-copy-to-clipboard';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/use-manual-fix-form';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	AIHeader,
	AITitle,
	InfotipBox,
	ManualTextField,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ResolveWithAi = ({ item, current }) => {
	const { manualData, openedBlock } = useScannerWizardContext();
	const { copied, copyToClipboard } = useCopyToClipboard();
	const { getAISuggestion, resolveIssue, aiResponseLoading, resolving } =
		useManualFixForm({
			item,
			current,
		});

	const [openUpgrade, setOpenUpgrade] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [manualEdit, setManualEdit] = useState(false);
	const [aiSuggestion, setAiSuggestion] = useState(null);

	useEffect(() => {
		setAiSuggestion({
			...manualData[openedBlock][current]?.aiSuggestion,
			submitted: false,
		});
		setManualEdit(manualData[openedBlock][current]?.aiSuggestion?.snippet);
	}, [manualData[openedBlock][current]?.aiSuggestion]);

	const openEdit = () => {
		setIsEdit(true);
		mixpanelService.sendEvent(mixpanelEvents.editSnippetClicked, {
			snippet_content: aiSuggestion.snippet,
			category_name: BLOCK_TITLES[openedBlock],
			source: 'assistant',
		});
	};

	const closeEdit = () => setIsEdit(false);

	const handleButtonClick = async () => {
		if (IS_AI_ENABLED && AI_QUOTA_LIMIT) {
			await getAISuggestion();
			mixpanelService.sendEvent(mixpanelEvents.fixWithAiButtonClicked, {
				issue_type: item.message,
				rule_id: item.ruleId,
				wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
				category_name: BLOCK_TITLES[openedBlock],
				// ai_text_response: text,
			});
		} else {
			setOpenUpgrade(true);
			mixpanelService.sendEvent(mixpanelEvents.upgradeSuggestionViewed, {
				current_plan: window.ea11yScannerData?.planData?.plan?.name,
				action_trigger: 'fix_with_ai',
				feature_locked: 'AI manual',
			});
		}
	};

	const closeUpgrade = () => setOpenUpgrade(false);

	const disabled =
		aiResponseLoading ||
		resolving ||
		(isEdit && !manualEdit) ||
		(isEdit && manualEdit === aiSuggestion?.snippet);

	const onResolve = async () => {
		await resolveIssue(isEdit ? manualEdit : null);
		setAiSuggestion({
			...aiSuggestion,
			snippet: manualEdit,
			submitted: !isEdit,
		});
	};

	const onManualEdit = (e) => {
		setManualEdit(e.target.value);
		setAiSuggestion({ ...aiSuggestion, submitted: false });
	};

	return aiSuggestion?.snippet ? (
		<Box>
			<Card variant="outlined" sx={{ overflow: 'visible' }}>
				<CardContent sx={{ pt: 1.5, pb: 0 }}>
					<AIHeader>
						<AITitle>
							<AIIcon />
							<Typography variant="subtitle2">
								{__('Resolve with AI', 'pojo-accessibility')}
							</Typography>
							{aiSuggestion?.explanation && (
								<Infotip
									placement="top"
									PopperProps={{
										disablePortal: true,
									}}
									content={
										<InfotipBox>
											<Typography
												variant="subtitle1"
												sx={{ mb: 1, textTransform: 'none' }}
											>
												{__('How AI resolves this?', 'pojo-accessibility')}
											</Typography>
											<Typography variant="body2">
												{aiSuggestion.explanation}
											</Typography>
										</InfotipBox>
									}
								>
									<InfoCircleIcon fontSize="small" />
								</Infotip>
							)}
						</AITitle>
						{!isEdit && (
							<Tooltip
								placement="top"
								title={__('Edit', 'pojo-accessibility')}
								PopperProps={{
									disablePortal: true,
								}}
							>
								<IconButton size="tiny" onClick={openEdit}>
									<EditIcon fontSize="small" />
								</IconButton>
							</Tooltip>
						)}
					</AIHeader>
					{isEdit ? (
						<ManualTextField
							value={manualEdit}
							color="secondary"
							size="small"
							multiline
							fullWidth
							onChange={onManualEdit}
							inputProps={{
								'aria-label': __('Manual edit', 'pojo-accessibility'),
							}}
						/>
					) : (
						<StyledAlert color="info" icon={false} disabled={disabled}>
							<Box display="flex" gap={0.5} alignItems="start">
								<StyledSnippet variant="body2" sx={{ width: '290px' }}>
									{aiSuggestion.snippet}
								</StyledSnippet>
								<Box>
									<Tooltip
										arrow
										placement="bottom"
										title={
											copied
												? __('Copied!', 'pojo-accessibility')
												: __('Copy', 'pojo-accessibility')
										}
										PopperProps={{
											disablePortal: true,
										}}
									>
										<IconButton
											size="tiny"
											onClick={copyToClipboard(
												aiSuggestion.snippet,
												'fixed_snippet',
												'assistant',
											)}
										>
											<CopyIcon fontSize="tiny" />
										</IconButton>
									</Tooltip>
								</Box>
							</Box>
						</StyledAlert>
					)}
				</CardContent>
				<CardActions sx={{ p: 2 }}>
					{isEdit ? (
						<Button
							size="small"
							color="secondary"
							variant="text"
							onClick={closeEdit}
						>
							{__('Cancel', 'pojo-accessibility')}
						</Button>
					) : (
						<Tooltip
							arrow
							placement="bottom"
							title={__('Generate another solution', 'pojo-accessibility')}
							PopperProps={{
								disablePortal: true,
							}}
						>
							<Button
								size="small"
								color="secondary"
								variant="text"
								onClick={handleButtonClick}
								disabled={disabled}
								loading={aiResponseLoading}
								loadingPosition="start"
								aria-label={__('Retry', 'pojo-accessibility')}
							>
								{__('Retry', 'pojo-accessibility')}
							</Button>
						</Tooltip>
					)}

					<Button
						size="small"
						color="info"
						variant="contained"
						disabled={disabled || aiSuggestion?.submitted}
						loading={resolving}
						loadingPosition="start"
						onClick={onResolve}
					>
						{isEdit
							? __('Apply changes', 'pojo-accessibility')
							: __('Apply fix', 'pojo-accessibility')}
					</Button>
				</CardActions>
			</Card>
		</Box>
	) : (
		<Box>
			<UpgradeInfoTip closeUpgrade={closeUpgrade} openUpgrade={openUpgrade}>
				<Button
					variant="contained"
					size="small"
					color={IS_AI_ENABLED && AI_QUOTA_LIMIT ? 'info' : 'promotion'}
					startIcon={<AIIcon />}
					fullWidth
					disabled={aiResponseLoading}
					loading={aiResponseLoading}
					onClick={handleButtonClick}
				>
					{__('Let AI resolve it for you', 'pojo-accessibility')}
				</Button>
			</UpgradeInfoTip>
		</Box>
	);
};

ResolveWithAi.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
};
