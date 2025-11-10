import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import ChevronUpIcon from '@elementor/icons/ChevronUpIcon';
import ExternalLinkIcon from '@elementor/icons/ExternalLinkIcon';
import HelpIcon from '@elementor/icons/HelpIcon';
import UserIcon from '@elementor/icons/UserIcon';
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
import WhatsNewDrawer from '@ea11y/components/whats-new/drawer';
import { useSettings } from '@ea11y/hooks';
import { useWhatsNew } from '@ea11y/hooks/use-whats-new';
import SpeakerphoneIcon from '@ea11y/icons/speakerphone-icon';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { openLink } from '../../utils';

const SpeakerphoneIconWrapper = styled(ListItemIcon)`
	&::after {
		content: '';
		display: block;
		position: relative;
		left: -5px;
		top: -4px;

		width: 8px;
		height: 8px;

		border-radius: 100%;
		background: ${({ theme }) => theme.palette.info.main};
	}
`;
const MyAccountMenu = () => {
	const { openSidebar } = useSettings();
	const { isSidebarOpen, open, close } = useWhatsNew();

	const accountMenuState = usePopupState({
		variant: 'popover',
		popupId: 'myAccountMenu',
	});

	const handleHelpButtonClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.helpButtonClicked, {
			source: 'Header',
		});
		openLink(GOLINKS.HELP);
	};

	const handleWhatsNewButtonClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: 'Whats new?',
		});
		open();
	};

	return (
		<>
			<List
				onClick={() => {
					mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
						buttonName: 'My Account',
					});
				}}
			>
				<StyledListItemButton
					shape="rounded"
					onClick={handleHelpButtonClick}
					dense
				>
					<ListItemIcon
						sx={{
							/*For smoother sidebar*/ padding: openSidebar ? 'auto' : '6px',
						}}
					>
						<HelpIcon
							role="img"
							aria-label={__('Help center', 'pojo-accessibility')}
							sx={{ color: 'common.black' }}
							fontSize="small"
						/>
					</ListItemIcon>

					<ListItemText
						primary={__('Help center', 'pojo-accessibility')}
						hidden={!openSidebar}
						sx={{ whiteSpace: 'nowrap' }}
					/>

					<ListItemIcon sx={{ display: !openSidebar ? 'none' : 'default' }}>
						<ExternalLinkIcon
							role="img"
							aria-label={__('Help center', 'pojo-accessibility')}
						/>
					</ListItemIcon>
				</StyledListItemButton>

				<StyledListItemButton
					shape="rounded"
					onClick={handleWhatsNewButtonClick}
					dense
				>
					<SpeakerphoneIconWrapper
						sx={{
							/*For smoother sidebar*/ padding: openSidebar ? 'auto' : '6px',
						}}
					>
						<SpeakerphoneIcon
							role="presentation"
							sx={{ color: 'common.black' }}
							fontSize="small"
						/>
					</SpeakerphoneIconWrapper>

					<ListItemText
						primary={__("What's new?", 'pojo-accessibility')}
						hidden={!openSidebar}
						sx={{ whiteSpace: 'nowrap' }}
					/>
				</StyledListItemButton>

				<StyledListItemButton
					{...bindTrigger(accountMenuState)}
					selected={accountMenuState.isOpen}
					shape="rounded"
					dense
				>
					<ListItemIcon
						sx={{
							/*For smoother sidebar*/ padding: openSidebar ? 'auto' : '6px',
						}}
					>
						<UserIcon
							role="img"
							aria-label={__('My Account', 'pojo-accessibility')}
							sx={{ color: 'common.black' }}
							fontSize="small"
						/>
					</ListItemIcon>

					<ListItemText
						primary={__('My Account', 'pojo-accessibility')}
						hidden={!openSidebar}
						sx={{ whiteSpace: 'nowrap' }}
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

			{isSidebarOpen && <WhatsNewDrawer onClose={close} />}
		</>
	);
};

export default MyAccountMenu;

const StyledListItemButton = styled(ListItemButton)`
	justify-content: center;
	padding: ${({ theme }) => `${theme.spacing(1)} ${theme.spacing(3)}`};
`;
