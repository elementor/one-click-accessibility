import TrashIcon from '@elementor/icons/TrashIcon';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { DeleteGlobalRemediationModal } from '@ea11y-apps/scanner/components/remediation-confirmation-modal';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useGlobalManageActions } from '@ea11y-apps/scanner/hooks/use-global-manage-actions';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DeleteGlobalButton = () => {
	const { globalRemediations } = useScannerWizardContext();
	const { deleteGlobalRemediations } = useGlobalManageActions();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const onShowDeleteModal = () => {
		setShowDeleteModal(true);
		mixpanelService.sendEvent(mixpanelEvents.popupButtonClicked, {
			data: {
				popupType: 'global_delete_confirmation',
				buttonName: 'Remove all',
			},
		});
	};

	const onHideDeleteModal = () => setShowDeleteModal(false);

	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteGlobalRemediations();
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
				<IconButton size="tiny" color="error" onClick={onShowDeleteModal}>
					<TrashIcon fontSize="tiny" />
				</IconButton>
			</Tooltip>

			<DeleteGlobalRemediationModal
				open={showDeleteModal}
				hideConfirmation={onHideDeleteModal}
				onDelete={onDeleteRemediation}
				count={globalRemediations.length}
				isMain
			/>
		</>
	);
};

export default DeleteGlobalButton;
