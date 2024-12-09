import { ChevronDownIcon, UserIcon, ExternalLinkIcon } from '@elementor/icons';
import Avatar from '@elementor/ui/Avatar';
import Box from '@elementor/ui/Box';
import List from '@elementor/ui/List';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import Typography from '@elementor/ui/Typography';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { useSettings } from '@ea11y/hooks';
import { CreditCardIcon, UserArrowIcon } from '@ea11y/icons';
import { __ } from '@wordpress/i18n';
import API from '../../api';
import { BILLING_LINK } from '../../constants';

const MyAccountMenu = () => {
	const { openSidebar } = useSettings();
	const accountMenuState = usePopupState({
		variant: 'popover',
		popupId: 'myAccountMenu',
	});
	const onDeactivateAndDisconnect = () => {
		API.disconnect().then(() => API.redirectToConnect());
	};
	return (
		<>
			<List>
				<ListItemButton
					{...bindTrigger(accountMenuState)}
					sx={{ justifyContent: 'center' }}
				>
					<ListItemIcon>
						<UserIcon sx={{ color: 'common.black' }} />
					</ListItemIcon>
					<ListItemText
						primary={__('My Account', 'pojo-accessibility')}
						hidden={!openSidebar}
					/>
					<ListItemIcon sx={{ display: !openSidebar ? 'none' : 'default' }}>
						<ChevronDownIcon />
					</ListItemIcon>
				</ListItemButton>
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
					sx={{ gap: 1, width: '225px' }}
				>
					<Avatar>JB</Avatar>
					<Box display="flex" flexDirection="column" gap={0}>
						<Typography variant="subtitle2" color="common.white">
							Jack Baueuer
						</Typography>
						<Typography variant="caption" color="common.white">
							jack@bauer.com
						</Typography>
					</Box>
				</MenuItem>
				<MenuItem onClick={onDeactivateAndDisconnect}>
					<UserArrowIcon sx={{ color: 'common.white' }} />
					<Typography color="common.white" marginLeft={1}>
						{__('Switch account', 'pojo-accessibility')}
					</Typography>
				</MenuItem>
				<MenuItem href={BILLING_LINK} target="_blank">
					<CreditCardIcon sx={{ color: 'common.white' }} />
					<Typography color="common.white" marginLeft={1}>
						{__('Billing', 'pojo-accessibility')}
					</Typography>
					<ExternalLinkIcon
						fontSize="small"
						sx={{ color: 'common.white', marginLeft: 1 }}
					/>
				</MenuItem>
			</Menu>
		</>
	);
};

export default MyAccountMenu;
