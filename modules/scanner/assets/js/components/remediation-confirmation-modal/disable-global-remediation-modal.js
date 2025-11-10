import AlertOctagonFilledIcon from '@elementor/icons/AlertOctagonFilledIcon';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import ConfirmDialog from '@ea11y-apps/global/components/confirm-dialog';
import { __, sprintf } from '@wordpress/i18n';

const DisableGlobalRemediationModal = ({
	open,
	hideConfirmation,
	onDisable,
	count = null,
}) => {
	return (
		<ConfirmDialog
			open={open}
			onClose={hideConfirmation}
			onCancel={hideConfirmation}
			title={sprintf(
				// Translators: %s - fixes count
				__('Disable %s fixes across scans', 'pojo-accessibility'),
				count,
			)}
			approveButtonColor="warning"
			approveText={__('Disable everywhere', 'pojo-accessibility')}
			cancelText={__('Not now', 'pojo-accessibility')}
			logo={<AlertOctagonFilledIcon color="warning" sx={{ mt: '6px' }} />}
			onApprove={onDisable}
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
					'These fixes will be disabled on past and future scans, leaving the issues unresolved. You can always enable them again.',
					'pojo-accessibility',
				)}
			</Typography>
		</ConfirmDialog>
	);
};

DisableGlobalRemediationModal.propTypes = {
	open: PropTypes.bool.isRequired,
	hideConfirmation: PropTypes.func.isRequired,
	onDisable: PropTypes.func.isRequired,
	count: PropTypes.number.isRequired,
};

export default DisableGlobalRemediationModal;
