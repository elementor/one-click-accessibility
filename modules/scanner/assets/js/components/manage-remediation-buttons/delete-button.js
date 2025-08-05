import TrashIcon from '@elementor/icons/TrashIcon';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import { DeleteRemediationModal } from '@ea11y-apps/scanner/components/delete-remediation-modal';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const DeleteButton = ({ group }) => {
	const { deleteAllRemediationForPage } = useManageActions();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteAllRemediationForPage(group);
	};

	return (
		<>
			{group ? (
				<IconButton
					size="tiny"
					color="error"
					aria-label={__('Remove all remediations', 'pojo-accessibility')}
					onClick={toggleDeleteModal}
				>
					<TrashIcon fontSize="tiny" />
				</IconButton>
			) : (
				<Button
					startIcon={<TrashIcon />}
					size="small"
					color="error"
					variant="text"
					onClick={toggleDeleteModal}
				>
					{__('Remove all', 'pojo-accessibility')}
				</Button>
			)}

			<DeleteRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
				isMain
			/>
		</>
	);
};
