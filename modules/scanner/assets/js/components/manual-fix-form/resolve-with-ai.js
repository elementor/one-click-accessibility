import AIIcon from '@elementor/icons/AIIcon';
import CopyIcon from '@elementor/icons/CopyIcon';
import EditIcon from '@elementor/icons/EditIcon';
import InfoCircleIcon from '@elementor/icons/InfoCircleIcon';
import ResetIcon from '@elementor/icons/ResetIcon';
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
import { SetGlobal } from '@ea11y-apps/scanner/components/manage-footer-actions/page/set-global';
import { UpgradeInfoTip } from '@ea11y-apps/scanner/components/upgrade-info-tip';
import { AI_QUOTA_LIMIT, IS_PRO_PLAN } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useCopyToClipboard } from '@ea11y-apps/scanner/hooks/use-copy-to-clipboard';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/use-manual-fix-form';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	InfotipBox,
	ItemHeader,
	ItemTitle,
	ManualTextField,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ResolveWithAi = ({ item, current }) => {
	const { openedBlock } = useScannerWizardContext();
	const { copied, copyToClipboard } = useCopyToClipboard();
	const {
		isGlobal,
		setIsGlobal,
		manualEdit,
		setManualEdit,
		aiSuggestion,
		setAiSuggestion,
		getAISuggestion,
		resolveIssue,
		aiResponseLoading,
		resolving,
		isSubmitDisabled,
	} = useManualFixForm({
		item,
		current,
	});

	const [openUpgrade, setOpenUpgrade] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	const openEdit = () => {
		setIsEdit(true);
		mixpanelService.sendEvent(mixpanelEvents.editSnippetClicked, {
			snippet_content: aiSuggestion.snippet,
			category_name: openedBlock,
			source: 'assistant',
		});
	};

	const closeEdit = () => setIsEdit(false);

	const handleButtonClick = async () => {
		if (IS_PRO_PLAN && AI_QUOTA_LIMIT) {
			await getAISuggestion();
			mixpanelService.sendEvent(mixpanelEvents.fixWithAiButtonClicked, {
				issue_type: item.message,
				rule_id: item.ruleId,
				wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
				category_name: openedBlock,
				page_url: window.ea11yScannerData?.pageData?.url,
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
	const onGlobalChange = (value) => {
		setIsGlobal(value);
	};

	const disabled =
		aiResponseLoading ||
		resolving ||
		(isEdit && !manualEdit) ||
		(isEdit && manualEdit === aiSuggestion?.snippet);

	const onResolve = async () => {
		await resolveIssue();
		setAiSuggestion({
			...aiSuggestion,
			snippet: manualEdit,
			submitted: !isEdit,
		});
		setIsEdit(false);
	};

	const onManualEdit = (e) => {
		setManualEdit(e.target.value);
		setAiSuggestion({ ...aiSuggestion, submitted: false });
	};

	return aiSuggestion?.snippet ? (
		<Box>
			<Card variant="outlined" sx={{ overflow: 'visible' }}>
				<CardContent sx={{ pt: 1.5, pb: 0 }}>
					<ItemHeader>
						<ItemTitle>
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
									<InfoCircleIcon fontSize="small" color="action" />
								</Infotip>
							)}
						</ItemTitle>
						{!isEdit && (
							<Box>
								<Tooltip
									placement="top"
									title={__('Edit', 'pojo-accessibility')}
									PopperProps={{
										disablePortal: true,
									}}
								>
									<IconButton size="tiny" onClick={openEdit}>
										<EditIcon fontSize="tiny" />
									</IconButton>
								</Tooltip>
								<Tooltip
									placement="top"
									title={__('Retry', 'pojo-accessibility')}
									PopperProps={{
										disablePortal: true,
									}}
								>
									<IconButton
										size="tiny"
										onClick={handleButtonClick}
										disabled={disabled}
										loading={aiResponseLoading}
									>
										<ResetIcon fontSize="tiny" />
									</IconButton>
								</Tooltip>
								<Tooltip
									arrow
									placement="top"
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
						)}
					</ItemHeader>
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
								<StyledSnippet variant="body2">{manualEdit}</StyledSnippet>
							</Box>
						</StyledAlert>
					)}
				</CardContent>
				<CardActions
					sx={{ p: 2, justifyContent: isEdit ? 'flex-end' : 'space-between' }}
				>
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
						<SetGlobal
							item={item}
							onGlobalChange={onGlobalChange}
							isChecked={isGlobal}
						/>
					)}

					{isEdit ? (
						<Button
							size="small"
							color="info"
							variant="contained"
							disabled={disabled}
							onClick={closeEdit}
						>
							{__('Apply fix', 'pojo-accessibility')}
						</Button>
					) : (
						<Button
							size="small"
							color="info"
							variant="contained"
							disabled={disabled || isSubmitDisabled}
							loading={resolving}
							loadingPosition="center"
							onClick={onResolve}
						>
							{isGlobal
								? __('Apply to all', 'pojo-accessibility')
								: __('Apply fix', 'pojo-accessibility')}
						</Button>
					)}
				</CardActions>
			</Card>
		</Box>
	) : (
		<Box>
			<UpgradeInfoTip closeUpgrade={closeUpgrade} openUpgrade={openUpgrade}>
				<Button
					variant="contained"
					size="small"
					color={IS_PRO_PLAN && AI_QUOTA_LIMIT ? 'info' : 'promotion'}
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
