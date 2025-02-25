import Card from '@elementor/ui/Card';
import Modal from '@elementor/ui/Modal';

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
			<Card sx={style} />
		</Modal>
	);
};

export default UpgradeModal;
