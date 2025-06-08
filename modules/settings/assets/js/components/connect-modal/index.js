import Box from '@elementor/ui/Box';
import Grid from '@elementor/ui/Grid';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemText from '@elementor/ui/ListItemText';
import Modal from '@elementor/ui/Modal';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import Button from '@ea11y/components/button';
import ConnectModalCheckIcon from '@ea11y/components/connect-modal/check-icon';
import { useModal } from '@ea11y/hooks';
import { ConnectModalIcon } from '@ea11y/icons';
import { useAuth } from '@ea11y-apps/global/hooks/use-auth';
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
	max-width: 95%;
	height: 570px;
	gap: 0;
	background-color: ${({ theme }) => theme.palette.background.paper};
	padding: ${({ theme }) => theme.spacing(5)};
	text-align: center;
	border-radius: 4px;
`;

const StyledListItemText = styled(ListItemText)`
	margin: 0;
	padding: 0;

	color: ${({ theme }) => theme.palette.text.secondary};
`;

const StyledListItem = styled(ListItem)`
	margin: 8px;
	padding: 0;
`;

const ConnectModal = () => {
	const { isOpen } = useModal();
	const { redirectToConnect } = useAuth();

	return (
		<Modal open={isOpen}>
			<StyledGrid
				container
				tabindex="0"
				sx={{ boxShadow: 24 }}
				role="dialog"
				aria-modal="true"
				aria-labelledby="connect-modal-title"
				aria-describedby="connect-modal-description"
			>
				<ConnectModalIcon />

				<Typography
					variant="h5"
					color="text.primary"
					marginTop={5}
					marginBottom={1}
					id="connect-modal-title"
				>
					{__("Let's improve your site's accessibility", 'pojo-accessibility')}
				</Typography>

				<Typography
					variant="body2"
					color="text.primary"
					width={400}
					id="connect-modal-description"
				>
					{__(
						'Make your site more inclusive with Ally - Web Accessibility.',
						'pojo-accessibility',
					)}
				</Typography>

				<Box>
					<List dense={true}>
						<StyledListItem disableGutters>
							<ConnectModalCheckIcon />

							<StyledListItemText
								primary={__('Fully customizable design', 'pojo-accessibility')}
							/>
						</StyledListItem>

						<StyledListItem disableGutters>
							<ConnectModalCheckIcon />

							<StyledListItemText
								primary={__(
									'Feature management & control',
									'pojo-accessibility',
								)}
							/>
						</StyledListItem>

						<StyledListItem disableGutters>
							<ConnectModalCheckIcon />

							<StyledListItemText
								primary={__(
									'Accessibility statement generator',
									'pojo-accessibility',
								)}
							/>
						</StyledListItem>
					</List>

					<Button
						variant="contained"
						color="info"
						size="large"
						onClick={redirectToConnect}
						fullWidth
						sx={{ marginTop: 5 }}
					>
						{__('Get started', 'pojo-accessibility')}
					</Button>
				</Box>
			</StyledGrid>
		</Modal>
	);
};

export default ConnectModal;
