import TrashIcon from '@elementor/icons/TrashIcon';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import { DeletePageRemediationModal } from '@ea11y-apps/scanner/components/remediation-confirmation-modal';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const DeleteButton = () => {
	const { remediations } = useScannerWizardContext();
	const { deleteAllRemediationForPage } = useManageActions();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteAllRemediationForPage();
	};

	return (
		<>
			<Tooltip
				arrow
				placement="top"
				title={__('Remove all', 'pojo-accessibility')}
				PopperProps={{
					disablePortal: true,
				}}
			>
				<IconButton size="tiny" color="error" onClick={toggleDeleteModal}>
					<TrashIcon fontSize="tiny" />
				</IconButton>
			</Tooltip>

			<DeletePageRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
				count={remediations.length}
				isMain
			/>
		</>
	);
};
