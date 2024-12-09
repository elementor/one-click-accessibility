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
				gap={5}
				direction="column"
				alignItems="center"
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
					p: '40px 20px',
					textAlign: 'center',
					borderRadius: '4px',
				}}
			>
				<PostConnectModalIcon />
				<Grid
					container
					direction="column"
					justifyContent="center"
					alignItems="center"
					gap={2}
				>
					<Typography variant="h5" marginBottom={1}>
						{__('Awesome! Your site can now send emails', 'site-mailer')}
					</Typography>
					<Typography
						variant="body2"
						sx={{ width: '500px', maxWidth: '100%' }}
						marginBottom={1}
					>
						{__(
							'By default, emails from your site will be sent via:',
							'site-mailer',
						)}
						<br />
						<b>xyz@gmail.com</b>
						<br />
						{__(
							'You can change this address by adding a custom domain in the settings tab.',
							'site-mailer',
						)}
					</Typography>
				</Grid>
				<Button
					variant="contained"
					sx={{ padding: '8px 22px', width: '300px' }}
					onClick={onClose}
				>
					Got it!
				</Button>
			</Grid>
		</Modal>
	);
};

export default PostConnectModal;
