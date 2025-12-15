import AlertOctagonFilledIcon from '@elementor/icons/AlertOctagonFilledIcon';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import ConfirmDialog from '@ea11y-apps/global/components/confirm-dialog';
import { __, sprintf } from '@wordpress/i18n';

const DeletePageRemediationModal = ({
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
							__('Remove %s fixes?', 'pojo-accessibility'),
							count,
						)
					: __('Remove this fix?', 'pojo-accessibility')
			}
			approveText={
				isMain
					? __('Remove fixes', 'pojo-accessibility')
					: __('Remove fix', 'pojo-accessibility')
			}
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
							'This removes the fixes and marks the accessibility issues as unresolve. This can’t be undone.',
							'pojo-accessibility',
						)
					: __(
							'This removes the fix and marks the accessibility issue as unresolve. This can’t be undone.',
							'pojo-accessibility',
						)}
			</Typography>
		</ConfirmDialog>
	);
};

DeletePageRemediationModal.propTypes = {
	open: PropTypes.bool.isRequired,
	hideConfirmation: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	count: PropTypes.number,
	isMain: PropTypes.bool,
};

export default DeletePageRemediationModal;
