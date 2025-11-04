import AIIcon from '@elementor/icons/AIIcon';
import CopyIcon from '@elementor/icons/CopyIcon';
import EditIcon from '@elementor/icons/EditIcon';
import WorldIcon from '@elementor/icons/WorldIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import Chip from '@elementor/ui/Chip';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import ManageFooterActions from '@ea11y-apps/scanner/components/manage-footer-actions';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useCopyToClipboard } from '@ea11y-apps/scanner/hooks/use-copy-to-clipboard';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	ItemHeader,
	ItemTitle,
	ManualTextField,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const RemediationSnippet = ({ item }) => {
	const content = JSON.parse(item.content);

	const { openedBlock } = useScannerWizardContext();
	const { copied, copyToClipboard } = useCopyToClipboard();

	const { activeRequest, editRemediation } = useManageActions(item);

	const [isEdit, setIsEdit] = useState(false);
	const [manualEdit, setManualEdit] = useState(content.replace);

	const openEdit = () => {
		setIsEdit(true);
		mixpanelService.sendEvent(mixpanelEvents.editSnippetClicked, {
			snippet_content: content.replace,
			category_name: openedBlock,
			source: 'remediation',
		});
	};

	const closeEdit = () => setIsEdit(false);

	const onManualEdit = (e) => {
		setManualEdit(e.target.value);
	};

	const isActive =
		item.global === '1' ? item.active_for_page === '1' : item.active === '1';

	const submitRemediation = async () => {
		await editRemediation({
			...content,
			replace: manualEdit,
		});
		setIsEdit(false);
	};

	return (
		<Box sx={{ mb: 3 }}>
			<Card variant="outlined" sx={{ overflow: 'visible' }}>
				<CardContent sx={{ pt: 1.5, pb: 0 }}>
					<ItemHeader>
						<ItemTitle>
							<AIIcon />
							<Typography variant="subtitle2">
								{isActive
									? __('Active fix', 'pojo-accessibility')
									: __('Fix (disabled)', 'pojo-accessibility')}
							</Typography>
							{item.global && (
								<Chip
									icon={<WorldIcon fontSize="small" />}
									label={__('Cross-scan', 'pojo-accessibility')}
									color="default"
									variant="outlined"
									size="tiny"
								/>
							)}
						</ItemTitle>
						{!isEdit && (
							<Box display="flex" alignItems="center">
								{item.global === '1' ? (
									<Tooltip
										placement="top"
										title={__(
											"You can't edit cross-scan fixes with Ally",
											'pojo-accessibility',
										)}
										PopperProps={{
											disablePortal: true,
										}}
									>
										<EditIcon
											fontSize="tiny"
											color="disabled"
											sx={{ p: 0.5 }}
										/>
									</Tooltip>
								) : (
									<Tooltip
										placement="top"
										title={__('Edit', 'pojo-accessibility')}
										PopperProps={{
											disablePortal: true,
										}}
									>
										<IconButton
											size="tiny"
											onClick={openEdit}
											disabled={activeRequest}
										>
											<EditIcon fontSize="tiny" />
										</IconButton>
									</Tooltip>
								)}

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
											content.replace,
											'fixed_snippet',
											'remediation',
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
							disabled={activeRequest}
						/>
					) : (
						<StyledAlert
							color={isActive ? 'info' : 'secondary'}
							icon={false}
							disabled={!isActive}
						>
							<Box display="flex" gap={0.5} alignItems="start">
								<StyledSnippet
									variant="body2"
									color={isActive ? 'text.primary' : 'text.disabled'}
								>
									{content.replace}
								</StyledSnippet>
							</Box>
						</StyledAlert>
					)}
				</CardContent>
				<CardActions sx={{ p: 2 }}>
					{isEdit ? (
						<>
							<Button
								size="small"
								color="secondary"
								variant="text"
								onClick={closeEdit}
								disabled={activeRequest}
							>
								{__('Cancel', 'pojo-accessibility')}
							</Button>
							<Button
								size="small"
								color="info"
								variant="contained"
								loadingPosition="start"
								disabled={manualEdit === content.replace || activeRequest}
								onClick={submitRemediation}
							>
								{__('Apply changes', 'pojo-accessibility')}
							</Button>
						</>
					) : (
						<ManageFooterActions item={item} isActive={isActive} />
					)}
				</CardActions>
			</Card>
		</Box>
	);
};

RemediationSnippet.propTypes = {
	item: remediationItem,
};
