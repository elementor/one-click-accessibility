import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import ConfirmDialog from '@ea11y-apps/global/components/confirm-dialog';
import { __ } from '@wordpress/i18n';

export const SetGlobalRemediationModal = ({
	open,
	hideConfirmation,
	onApprove,
}) => {
	return (
		<ConfirmDialog
			open={open}
			onClose={hideConfirmation}
			onCancel={hideConfirmation}
			logo={false}
			title={__('Apply fix across scans?', 'pojo-accessibility')}
			approveText={__('Apply to all', 'pojo-accessibility')}
			cancelText={__('Cancel', 'pojo-accessibility')}
			approveButtonColor="info"
			onApprove={onApprove}
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
				{__(
					'This fix will apply to past and future scans, making the issue resolved.',
					'pojo-accessibility',
				)}
			</Typography>
		</ConfirmDialog>
	);
};

SetGlobalRemediationModal.propTypes = {
	open: PropTypes.bool.isRequired,
	hideConfirmation: PropTypes.func.isRequired,
	onApprove: PropTypes.func.isRequired,
};
