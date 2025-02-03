import {
	UserIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	HelpIcon,
	ExternalLinkIcon,
} from '@elementor/icons';
import Avatar from '@elementor/ui/Avatar';
import Box from '@elementor/ui/Box';
import List from '@elementor/ui/List';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { useSettings, useStorage, useToastNotification } from '@ea11y/hooks';
import { UserArrowIcon } from '@ea11y/icons';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import API from '../../api';
import { HELP_LINK } from '../../constants';

const StyledListItemButton = styled(ListItemButton)`
	justify-content: center;
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
`;

const MyAccountMenu = () => {
	const { openSidebar, planData } = useSettings();
	const { save } = useStorage();
	const { error } = useToastNotification();

	const accountMenuState = usePopupState({
		variant: 'popover',
		popupId: 'myAccountMenu',
	});

	const truncateEmail = (email, maxLength = 24) => {
		if (email === undefined || email === null) {
			return '';
		}

		if (email.length <= maxLength) {
			return email;
		}

		return email.slice(0, maxLength - 3) + '...';
	};

	const onDeactivateAndDisconnect = async () => {
		try {
			await API.disconnect();
			await API.redirectToConnect();

			await save({
				ea11y_close_post_connect_modal: false,
			});

			mixpanelService.sendEvent('menu_button_clicked', {
				buttonName: 'Switch account',
			});
		} catch (e) {
			error(
				__('Failed to switch account. Please try again.', 'pojo-accessibility'),
			);

			console.error(e);
		}
	};

	const handleHelpButtonClick = () => {
		mixpanelService.sendEvent('help_button_clicked', {
			source: 'Header',
		});
		window.open(HELP_LINK, '_blank');
	};

	return (
		<>
			<List
				onClick={() => {
					mixpanelService.sendEvent('menu_button_clicked', {
						buttonName: 'My Account',
					});
				}}
			>
				<StyledListItemButton shape="rounded" onClick={handleHelpButtonClick}>
					<ListItemIcon>
						<HelpIcon sx={{ color: 'common.black' }} fontSize="small" />
					</ListItemIcon>

					<ListItemText
						primary={__('Help center', 'pojo-accessibility')}
						hidden={!openSidebar}
					/>

					<ListItemIcon sx={{ display: !openSidebar ? 'none' : 'default' }}>
						<ExternalLinkIcon />
					</ListItemIcon>
				</StyledListItemButton>
				<StyledListItemButton
					{...bindTrigger(accountMenuState)}
					selected={accountMenuState.isOpen}
					shape="rounded"
				>
					<ListItemIcon>
						<UserIcon sx={{ color: 'common.black' }} fontSize="small" />
					</ListItemIcon>

					<ListItemText
						primary={__('My Account', 'pojo-accessibility')}
						hidden={!openSidebar}
					/>

					<ListItemIcon sx={{ display: !openSidebar ? 'none' : 'default' }}>
						{accountMenuState.isOpen ? (
							<ChevronDownIcon fontSize="small" />
						) : (
							<ChevronUpIcon fontSize="small" />
						)}
					</ListItemIcon>
				</StyledListItemButton>
			</List>

			<Menu
				{...bindMenu(accountMenuState)}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				PaperProps={{
					sx: {
						backgroundColor: 'text.primary',
					},
				}}
			>
				<MenuItem
					onClick={accountMenuState.close}
					sx={{ gap: 1, width: '240px' }}
				>
					<Avatar>
						<UserIcon sx={{ color: 'common.white' }} />
					</Avatar>

					<Box display="flex" flexDirection="column" gap={0}>
						{planData?.user?.email.length < 24 ? (
							<Typography variant="caption" color="common.white">
								{planData?.user?.email}
							</Typography>
						) : (
							<Tooltip title={planData?.user?.email}>
								<Typography variant="caption" color="common.white">
									{truncateEmail(planData?.user?.email)}
								</Typography>
							</Tooltip>
						)}
					</Box>
				</MenuItem>

				<MenuItem onClick={onDeactivateAndDisconnect}>
					<UserArrowIcon sx={{ color: 'common.white' }} />

					<Typography color="common.white" marginLeft={1}>
						{__('Switch account', 'pojo-accessibility')}
					</Typography>
				</MenuItem>
			</Menu>
		</>
	);
};

export default MyAccountMenu;
