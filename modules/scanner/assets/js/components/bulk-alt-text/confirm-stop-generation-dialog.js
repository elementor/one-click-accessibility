import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogTitle from '@elementor/ui/DialogTitle';
import Typography from '@elementor/ui/Typography';
import { FocusTrap } from 'focus-trap-react';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

const ConfirmStopGenerationDialog = ({ open, onKeepGenerating, onLeave }) => {
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
				onClose={onKeepGenerating}
				maxWidth="xs"
				fullWidth
				disablePortal
			>
				<DialogTitle>
					{__('Alt text generation is still in progress', 'pojo-accessibility')}
				</DialogTitle>
				<DialogContent>
					<Typography>
						{__(
							"Leaving now will stop the process. Any generated alt text won't be applied.",
							'pojo-accessibility',
						)}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={onLeave} color="secondary">
						{__('Leave without applying', 'pojo-accessibility')}
					</Button>
					<Button onClick={onKeepGenerating} variant="contained">
						{__('Keep generating', 'pojo-accessibility')}
					</Button>
				</DialogActions>
			</Dialog>
		</FocusTrap>
	);
};

ConfirmStopGenerationDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onKeepGenerating: PropTypes.func.isRequired,
	onLeave: PropTypes.func.isRequired,
};

export default ConfirmStopGenerationDialog;
