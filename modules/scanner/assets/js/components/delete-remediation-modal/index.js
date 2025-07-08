import AlertOctagonFilledIcon from '@elementor/icons/AlertOctagonFilledIcon';
import Typography from '@elementor/ui/Typography';
import ConfirmDialog from '@ea11y-apps/global/components/confirm-dialog';
import { __ } from '@wordpress/i18n';

export const DeleteRemediationModal = ({
	open,
	hideConfirmation,
	onDelete,
	isMain = false,
}) => {
	return (
		<ConfirmDialog
			open={open}
			onClose={hideConfirmation}
			onCancel={hideConfirmation}
			title={
				isMain
					? __('Delete fixes for this page?', 'pojo-accessibility')
					: __('Delete this fix?', 'pojo-accessibility')
			}
			approveText={
				isMain
					? __('Delete fixes', 'pojo-accessibility')
					: __('Delete fix', 'pojo-accessibility')
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
