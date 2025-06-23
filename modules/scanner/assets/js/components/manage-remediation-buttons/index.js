import BanIcon from '@elementor/icons/BanIcon';
import ReloadIcon from '@elementor/icons/ReloadIcon';
import TrashIcon from '@elementor/icons/TrashIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';
import { DeleteRemediationModal } from '@ea11y-apps/scanner/components/delete-remediation-modal';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManageRemediationButtons = () => {
	const { remediations } = useScannerWizardContext();
	const { updateAllRemediationForPage, deleteAllRemediationForPage } =
		useManageActions();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const isAllDisabled =
		remediations?.length ===
		remediations?.filter((remediation) => !Number(remediation.active))?.length;

	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteAllRemediationForPage();
	};

	return (
		<Box display="flex" gap={1}>
			<IconButton
				size="tiny"
				color="error"
				aria-label={__('Remove all remediations', 'pojo-accessibility')}
				onClick={toggleDeleteModal}
			>
				<TrashIcon fontSize="tiny" />
			</IconButton>
			<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
			{isAllDisabled ? (
				<Button
					startIcon={<ReloadIcon />}
					size="small"
					color="info"
					variant="text"
					onClick={updateAllRemediationForPage(true)}
				>
					{__('Enable all', 'pojo-accessibility')}
				</Button>
			) : (
				<Button
					startIcon={<BanIcon />}
					size="small"
					color="secondary"
					variant="text"
					onClick={updateAllRemediationForPage(false)}
				>
					{__('Disable all', 'pojo-accessibility')}
				</Button>
			)}
			<DeleteRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
				isMain
			/>
		</Box>
	);
};
