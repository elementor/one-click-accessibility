import InfoCircleFilledIcon from '@elementor/icons/InfoCircleFilledIcon';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import ConfirmDialog from '@ea11y-apps/global/components/confirm-dialog';
import { __, sprintf } from '@wordpress/i18n';

const EnableGlobalRemediationModal = ({
	open,
	hideConfirmation,
	onEnable,
	count,
}) => {
	return (
		<ConfirmDialog
			open={open}
			onClose={hideConfirmation}
			onCancel={hideConfirmation}
			title={sprintf(
				// Translators: %s - fixes count
				__('Enable %s fixes across scans', 'pojo-accessibility'),
				count,
			)}
			approveButtonColor="info"
			approveText={__('Enable everywhere', 'pojo-accessibility')}
			cancelText={__('Not now', 'pojo-accessibility')}
			logo={<InfoCircleFilledIcon color="info" sx={{ mt: '6px' }} />}
			onApprove={onEnable}
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
					'These fixes will be enabled on past and future scans, making the issues resolved. You can disable them again at any time.',
					'pojo-accessibility',
				)}
			</Typography>
		</ConfirmDialog>
	);
};

EnableGlobalRemediationModal.propTypes = {
	open: PropTypes.bool.isRequired,
	hideConfirmation: PropTypes.func.isRequired,
	onEnable: PropTypes.func.isRequired,
	count: PropTypes.number.isRequired,
};

export default EnableGlobalRemediationModal;
