import {
	UserIcon,
	ChevronUpIcon,
	ChevronDownIcon,
	HelpIcon,
	ExternalLinkIcon,
} from '@elementor/icons';
import List from '@elementor/ui/List';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import { styled } from '@elementor/ui/styles';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { PopupMenu } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { __ } from '@wordpress/i18n';
import { HELP_LINK } from '../../constants';

const MyAccountMenu = () => {
	const { openSidebar } = useSettings();

	const accountMenuState = usePopupState({
		variant: 'popover',
		popupId: 'myAccountMenu',
	});

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
			<PopupMenu
				{...bindMenu(accountMenuState)}
				closeAction={accountMenuState.close}
			/>
		</>
	);
};

export default MyAccountMenu;

const StyledListItemButton = styled(ListItemButton)`
	justify-content: center;
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
`;
