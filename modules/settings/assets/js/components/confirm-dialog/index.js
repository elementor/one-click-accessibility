import { AlertTriangleFilledIcon } from '@elementor/icons';
import Button from '@elementor/ui/Button';
import Dialog from '@elementor/ui/Dialog';
import DialogActions from '@elementor/ui/DialogActions';
import DialogContent from '@elementor/ui/DialogContent';
import DialogHeader from '@elementor/ui/DialogHeader';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';

const ConfirmDialog = ({
	title,
	onCancel,
	onClose,
	onApprove,
	approveText = __('Submit', 'pojo-accessibility'),
	cancelText = __('Cancel', 'pojo-accessibility'),
	approveButtonColor = 'error',
	approveButtonSize = 'medium',
	children,
	logo = <AlertTriangleFilledIcon color="error" />,
	showCancelButton = true,
	showApproveButton = true,
	approveButtonDisabled = false,
	showCloseButton = false,
	dividers = false,
	...props
}) => {
	return (
		<Dialog open onClose={onClose} {...props}>
			<DialogHeader logo={logo} onClose={showCloseButton ? onClose : false}>
				<Typography variant="subtitle1">{title}</Typography>
			</DialogHeader>

			<DialogContent dividers={dividers}>{children}</DialogContent>

			<DialogActions>
				{showCancelButton && (
					<Button onClick={onCancel} color="secondary">
						{cancelText}
					</Button>
				)}
				{showApproveButton && (
					<Button
						variant="contained"
						disabled={approveButtonDisabled}
						color={approveButtonColor}
						size={approveButtonSize}
						onClick={onApprove}
					>
						{approveText}
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
