import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogTitle from '@elementor/ui/DialogTitle';
import Typography from '@elementor/ui/Typography';
import { FocusTrap } from 'focus-trap-react';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

const ConfirmCloseDialog = ({
	open,
	onDiscard,
	onApply,
	onCancel,
	loading,
}) => {
	return (
		<FocusTrap
			active={open}
			focusTrapOptions={{
				allowOutsideClick: true,
				escapeDeactivates: false,
				returnFocusOnDeactivate: true,
			}}
		>
			<Dialog
				open={open}
				onClose={onCancel}
				maxWidth="xs"
				fullWidth
				disablePortal
			>
				<DialogTitle>
					{__('Apply changes before leaving?', 'pojo-accessibility')}
				</DialogTitle>
				<DialogContent>
					<Typography>
						{__(
							"If you leave now, your alt text updates won't be applied.",
							'pojo-accessibility',
						)}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={onDiscard} color="secondary" disabled={loading}>
						{__('Discard changes', 'pojo-accessibility')}
					</Button>
					<Button onClick={onApply} variant="contained" disabled={loading}>
						{loading
							? __('Applying…', 'pojo-accessibility')
							: __('Apply all', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>
		</FocusTrap>
	);
};

ConfirmCloseDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onDiscard: PropTypes.func.isRequired,
	onApply: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default ConfirmCloseDialog;
