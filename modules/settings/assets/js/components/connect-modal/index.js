import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import Modal from '@elementor/ui/Modal';
import Typography from '@elementor/ui/Typography';
import { __ } from '@wordpress/i18n';
import { useAuth, useModal } from '../../hooks';

function ConnectModal() {
	const { isOpen } = useModal();
	const { redirectToConnect } = useAuth();

	return (
		<Modal open={ isOpen }>
			<Grid container
				gap={ 2 }
				direction="column"
				justifyContent="start"
				alignItems="center"
				sx={ {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 600,
					maxWidth: '95%',
					height: 400,
					bgcolor: 'background.paper',
					boxShadow: 24,
					paddingBottom: 5,
					textAlign: 'center',
					borderRadius: '4px',
				} }>
				<Box component="div" sx={ { background: '#000', width: '100%', height: '200px' } }></Box>
				<Typography variant="subtitle1"
					marginTop={ 5 }
					marginBottom={ 3 }>
					{ __( 'Connect plugin on your site!', 'pojo-accessibility' ) }
				</Typography>
				<Button variant="contained"
					color="info"
					size="large"
					onClick={ redirectToConnect }>
					{ __( 'Connect', 'pojo-accessibility' ) }
				</Button>
			</Grid>
		</Modal>
	);
}

export default ConnectModal;
