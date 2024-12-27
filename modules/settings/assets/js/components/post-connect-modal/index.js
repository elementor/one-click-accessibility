import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import Modal from '@elementor/ui/Modal';
import Typography from '@elementor/ui/Typography';
import { useModal, useStorage } from '@ea11y/hooks';
import { PostConnectModalIcon } from '@ea11y/icons';
import { __ } from '@wordpress/i18n';

const PostConnectModal = () => {
	const { isOpen, close } = useModal();
	const { save } = useStorage();

	const onClose = async () => {
		await save({
			ea11y_close_post_connect_modal: true,
		});
		close();
	};

	return (
		<Modal open={isOpen}>
			<Grid
				container
				direction="column"
				alignItems="center"
				justifyContent="center"
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 600,
					maxWidth: '100%',
					height: 530,
					backgroundColor: 'background.paper',
					boxShadow: 24,
					p: '20px',
					textAlign: 'center',
					borderRadius: '4px',
				}}
			>
				<PostConnectModalIcon />
				<Typography
					variant="h5"
					color="text.primary"
					marginTop={5}
					marginBottom={1}
				>
					{__("You're all set", 'site-mailer')}
				</Typography>
				<Typography
					variant="body2"
					sx={{ width: '500px', maxWidth: '100%' }}
					color="text.primary"
					marginBottom={5}
				>
					{__(
						'The One Click Accessibility widget is now active and ready to use on your site!',
						'site-mailer',
					)}
				</Typography>
				<Button
					variant="contained"
					sx={{ padding: '8px 22px', width: '300px' }}
					onClick={onClose}
					color="info"
				>
					{__('Done', 'pojo-accessibility')}
				</Button>
			</Grid>
		</Modal>
	);
};

export default PostConnectModal;
