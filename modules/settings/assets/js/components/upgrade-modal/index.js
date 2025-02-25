import Card from '@elementor/ui/Card';
import Modal from '@elementor/ui/Modal';
import Typography from '@elementor/ui/Typography';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	p: 4,
};

const UpgradeModal = () => {
	return (
		<Modal
			open
			disablePortal
			aria-labelledby="upgrade-modal-title"
			aria-describedby="upgrade-modal-description"
		>
			<Card sx={style}>
				<Typography id="upgrade-modal-title" variant="h6" component="h2">
					Text in a modal
				</Typography>
				<Typography id="upgrade-modal-description" sx={{ mt: 2 }}>
					Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
				</Typography>
			</Card>
		</Modal>
	);
};

export default UpgradeModal;
