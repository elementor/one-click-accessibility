import { CircleCheckFilledIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import Grid from '@elementor/ui/Grid';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Modal from '@elementor/ui/Modal';
import Typography from '@elementor/ui/Typography';
import { useAuth, useModal } from '@ea11y/hooks';
import { __ } from '@wordpress/i18n';
import ConnectModalIcon from './connect-modal-icon';

function ConnectModal() {
	const { isOpen } = useModal();
	const { redirectToConnect } = useAuth();

	const ListItemStyle = { margin: '8px', padding: 0 };
	const ListItemTextStyle = { color: 'text.secondary', margin: 0, padding: 0 };
	const listIconColor = 'info.main';

	return (
		<Modal open={isOpen}>
			<Grid
				container
				gap={0}
				direction="column"
				justifyContent="start"
				alignItems="center"
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 600,
					maxWidth: '95%',
					height: 552,
					backgroundColor: 'background.paper',
					boxShadow: 24,
					p: 5,
					textAlign: 'center',
					borderRadius: '4px',
				}}
			>
				<ConnectModalIcon />
				<Typography
					variant="h5"
					color="text.primary"
					marginTop={5}
					marginBottom={1}
				>
					{__("Let's improve your site's accessibility", 'pojo-accessibility')}
				</Typography>
				<Typography variant="body2" color="text.primary" width={400}>
					{__(
						'Make your site more inclusive with One Click Accessibility',
						'pojo-accessibility',
					)}
				</Typography>
				<Box>
					<List dense={true}>
						<ListItem disableGutters sx={ListItemStyle}>
							<ListItemIcon sx={{ color: listIconColor }}>
								<CircleCheckFilledIcon width={20} />
							</ListItemIcon>
							<ListItemText
								sx={ListItemTextStyle}
								primary={__('Fully customizable design', 'pojo-accessibility')}
							/>
						</ListItem>
						<ListItem disableGutters sx={ListItemStyle}>
							<ListItemIcon sx={{ color: listIconColor }}>
								<CircleCheckFilledIcon width={20} />
							</ListItemIcon>
							<ListItemText
								sx={ListItemTextStyle}
								primary={__(
									'Feature management & control',
									'pojo-accessibility',
								)}
							/>
						</ListItem>
						<ListItem disableGutters sx={ListItemStyle}>
							<ListItemIcon sx={{ color: listIconColor }}>
								<CircleCheckFilledIcon width={20} />
							</ListItemIcon>
							<ListItemText
								sx={ListItemTextStyle}
								primary={__(
									'Accessibility statement generator',
									'pojo-accessibility',
								)}
							/>
						</ListItem>
					</List>
					<Button
						variant="contained"
						color="info"
						size="large"
						onClick={redirectToConnect}
						fullWidth
						sx={{ marginTop: 5 }}
					>
						{__('Get Started', 'pojo-accessibility')}
					</Button>
				</Box>
			</Grid>
		</Modal>
	);
}

export default ConnectModal;
