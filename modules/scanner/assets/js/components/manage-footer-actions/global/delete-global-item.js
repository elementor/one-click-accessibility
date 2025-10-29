import TrashIcon from '@elementor/icons/TrashIcon';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';

import Tooltip from '@elementor/ui/Tooltip';
import PropTypes from 'prop-types';
import { DeleteGlobalRemediationModal } from '@ea11y-apps/scanner/components/remediation-confirmation-modal';
import { useGlobalManageActions } from '@ea11y-apps/scanner/hooks/use-global-manage-actions';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const DeleteGlobalItem = ({ id, rule }) => {
	const { activeRequest, deleteGlobalRemediation } = useGlobalManageActions();
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteGlobalRemediation(id, rule);
	};

	return (
		<>
			<Tooltip
				placement="top"
				title={__('Remove', 'pojo-accessibility')}
				PopperProps={{
					disablePortal: true,
				}}
			>
				<IconButton
					size="tiny"
					color="error"
					onClick={toggleDeleteModal}
					disabled={activeRequest}
				>
					<TrashIcon fontSize="tiny" />
				</IconButton>
			</Tooltip>
			<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
			<DeleteGlobalRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
			/>
		</>
	);
};

DeleteGlobalItem.propTypes = {
	id: PropTypes.number.isRequired,
	rule: PropTypes.string.isRequired,
};

export default DeleteGlobalItem;
