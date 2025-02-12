import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import Modal from '@elementor/ui/Modal';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import { useModal, useStorage } from '@ea11y/hooks';
import { PostConnectModalIcon } from '@ea11y/icons';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const StyledGrid = styled(Grid)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	width: 600px;
	max-width: 100%;
	height: 530px;
	background-color: ${({ theme }) => theme.palette.background.paper};
	padding: 20px;
	text-align: center;
	border-radius: 4px;
`;

const PostConnectModal = () => {
	const { isOpen, close } = useModal();
	const { save } = useStorage();

	useEffect(() => {
		if (isOpen) {
			mixpanelService.sendEvent('connect_success');
		}
	}, [isOpen]);

	const onClose = async () => {
		await save({
			ea11y_close_post_connect_modal: true,
		});

		close();
	};

	return (
		<Modal open={isOpen}>
			<StyledGrid container sx={{ boxShadow: 24 }}>
				<PostConnectModalIcon />

				<Typography
					variant="h5"
					color="text.primary"
					marginTop={5}
					marginBottom={1}
				>
					{__("You're all set", 'pojo-accessibility')}
				</Typography>

				<Typography
					variant="body2"
					sx={{ width: '500px', maxWidth: '100%' }}
					color="text.primary"
					marginBottom={5}
				>
					{__(
						'Ally - Web Accessibility is now connected and ready to use on your site.',
						'pojo-accessibility',
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
			</StyledGrid>
		</Modal>
	);
};

export default PostConnectModal;
