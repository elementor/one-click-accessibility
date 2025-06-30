import AIIcon from '@elementor/icons/AIIcon';
import BanIcon from '@elementor/icons/BanIcon';
import CopyIcon from '@elementor/icons/CopyIcon';
import EditIcon from '@elementor/icons/EditIcon';
import ReloadIcon from '@elementor/icons/ReloadIcon';
import TrashIcon from '@elementor/icons/TrashIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Card from '@elementor/ui/Card';
import CardActions from '@elementor/ui/CardActions';
import CardContent from '@elementor/ui/CardContent';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { DeleteRemediationModal } from '@ea11y-apps/scanner/components/delete-remediation-modal';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useCopyToClipboard } from '@ea11y-apps/scanner/hooks/use-copy-to-clipboard';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	AIHeader,
	AITitle,
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

	const {
		activeRequest,
		deleteRemediation,
		updateRemediation,
		editRemediation,
	} = useManageActions(item);

	const [isEdit, setIsEdit] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
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

	const isActive = Number(item.active);

	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteRemediation();
	};

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
					<AIHeader>
						<AITitle>
							<AIIcon />
							<Typography variant="subtitle2">
								{isActive
									? __('Active fix', 'pojo-accessibility')
									: __('Fix (disabled)', 'pojo-accessibility')}
							</Typography>
						</AITitle>
						{!isEdit && (
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
							disabled={activeRequest}
						/>
					) : (
						<StyledAlert
							color={isActive ? 'info' : 'secondary'}
							icon={false}
							disabled={!isActive}
						>
							<Box display="flex" gap={0.5} alignItems="start">
								<StyledSnippet variant="body2" sx={{ width: '290px' }}>
									{content.replace}
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
												content.replace,
												'fixed_snippet',
												'remediation',
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
						<Box display="flex" gap={1}>
							<IconButton
								size="tiny"
								color="error"
								aria-label={__('Remove remediation', 'pojo-accessibility')}
								onClick={toggleDeleteModal}
								disabled={activeRequest}
							>
								<TrashIcon fontSize="tiny" />
							</IconButton>
							<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
							{isActive ? (
								<Button
									startIcon={<BanIcon />}
									size="small"
									color="secondary"
									variant="text"
									disabled={activeRequest}
									onClick={updateRemediation(false)}
								>
									{__('Disable', 'pojo-accessibility')}
								</Button>
							) : (
								<Button
									startIcon={<ReloadIcon />}
									size="small"
									color="info"
									variant="text"
									disabled={activeRequest}
									onClick={updateRemediation(true)}
								>
									{__('Enable', 'pojo-accessibility')}
								</Button>
							)}
						</Box>
					)}
				</CardActions>
			</Card>
			<DeleteRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
			/>
		</Box>
	);
};

RemediationSnippet.propTypes = {
	item: remediationItem,
};
