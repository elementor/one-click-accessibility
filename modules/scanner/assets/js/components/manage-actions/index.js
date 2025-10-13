import ReloadIcon from '@elementor/icons/ReloadIcon';
import TrashIcon from '@elementor/icons/TrashIcon';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Divider from '@elementor/ui/Divider';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import PropTypes from 'prop-types';
import { DeleteRemediationModal } from '@ea11y-apps/scanner/components/delete-remediation-modal';
import { SetGlobal } from '@ea11y-apps/scanner/components/manage-actions/set-global';
import { useManageActions } from '@ea11y-apps/scanner/hooks/use-manage-actions';
import { StyledBanIcon } from '@ea11y-apps/scanner/styles/app.styles';
import { remediationItem } from '@ea11y-apps/scanner/types/remediation-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const ManageActions = ({ item, isActive }) => {
	const { activeRequest, deleteRemediation, updateRemediation } =
		useManageActions(item);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);
	const onDeleteRemediation = async () => {
		setShowDeleteModal(false);
		await deleteRemediation();
	};
	return (
		<Box
			display="flex"
			gap={1}
			justifyContent={isActive ? 'space-between' : 'flex-end'}
			sx={{ width: '100%' }}
		>
			{isActive ? (
				<>
					<SetGlobal item={item} />
					<Button
						startIcon={<StyledBanIcon />}
						size="small"
						color="secondary"
						variant="outlined"
						disabled={activeRequest}
						onClick={updateRemediation(false)}
					>
						{__('Disable fix', 'pojo-accessibility')}
					</Button>
				</>
			) : (
				<Box display="flex" gap={0.5}>
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
					<Button
						startIcon={<ReloadIcon />}
						size="small"
						color="info"
						variant="text"
						disabled={activeRequest}
						onClick={updateRemediation(true)}
					>
						{__('Enable fix', 'pojo-accessibility')}
					</Button>
				</Box>
			)}
			<DeleteRemediationModal
				open={showDeleteModal}
				hideConfirmation={toggleDeleteModal}
				onDelete={onDeleteRemediation}
			/>
		</Box>
	);
};

ManageActions.propTypes = {
	item: remediationItem,
	isActive: PropTypes.bool.isRequired,
};
