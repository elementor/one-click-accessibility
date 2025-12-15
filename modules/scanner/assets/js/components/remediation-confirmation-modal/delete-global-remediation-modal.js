import AlertOctagonFilledIcon from '@elementor/icons/AlertOctagonFilledIcon';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import ConfirmDialog from '@ea11y-apps/global/components/confirm-dialog';
import { __, sprintf } from '@wordpress/i18n';

const DeleteGlobalRemediationModal = ({
	open,
	hideConfirmation,
	onDelete,
	count = null,
	isMain = false,
}) => {
	return (
		<ConfirmDialog
			open={open}
			onClose={hideConfirmation}
			onCancel={hideConfirmation}
			title={
				isMain
					? sprintf(
							// Translators: %s - fixes count
							__('Remove %s fixes across scans', 'pojo-accessibility'),
							count,
						)
					: __('Remove fix across scans?', 'pojo-accessibility')
			}
			approveText={__('Remove everywhere', 'pojo-accessibility')}
			cancelText={__('Not now', 'pojo-accessibility')}
			logo={<AlertOctagonFilledIcon color="error" sx={{ mt: '6px' }} />}
			onApprove={onDelete}
			showCloseButton
			disablePortal
			PaperProps={{
				sx: {
					maxWidth: '440px',
					width: '100%',
				},
			}}
		>
			<Typography variant="body2">
				{isMain
					? __(
							'These fixes will no longer apply to past or future scans, leaving the issues unresolved.',
							'pojo-accessibility',
						)
					: __(
							'This fix will no longer apply to past or future scans, leaving the issue unresolved.',
							'pojo-accessibility',
						)}
			</Typography>
		</ConfirmDialog>
	);
};

DeleteGlobalRemediationModal.propTypes = {
	open: PropTypes.bool.isRequired,
	hideConfirmation: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	count: PropTypes.number,
	isMain: PropTypes.bool,
};

export default DeleteGlobalRemediationModal;
