import { HelpIcon, UserIcon } from '@elementor/icons';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { PopupMenu } from '@ea11y/components';
import WhatsNewDrawer from '@ea11y/components/whats-new/drawer';
import { useWhatsNew } from '@ea11y/hooks/use-whats-new';
import SpeakerphoneIcon from '@ea11y/icons/speakerphone-icon';
import { GOLINKS } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { openLink } from '../utils/index';

const TopBarMenu = () => {
	const { isSidebarOpen, open, close } = useWhatsNew();
	const accountMenuState = usePopupState({
		variant: 'popover',
		popupId: 'myAccountMenu',
	});

	const handleWhatsNewButtonClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: 'Whats new?',
		});
		open();
	};

	const handleHelpButtonClick = () => {
		mixpanelService.sendEvent(mixpanelEvents.helpButtonClicked, {
			source: 'Header',
		});
		openLink(GOLINKS.HELP);
	};

	return (
		<>
			<Box display="flex" flexDirection="row" gap={1} alignItems="center">
				<Button
					size="medium"
					color="secondary"
					startIcon={
						<SpeakerphoneIcon
							role="presentation"
							aria-label={__("What's new menu button", 'pojo-accessibility')}
							sx={{ color: 'common.black' }}
							fontSize="small"
						/>
					}
					onClick={handleWhatsNewButtonClick}
				>
					{__("What's new", 'pojo-accessibility')}
				</Button>
				<Button
					size="medium"
					color="secondary"
					startIcon={
						<HelpIcon
							aria-label={__('Help', 'pojo-accessibility')}
							role="presentation"
							sx={{ color: 'common.black' }}
							fontSize="small"
						/>
					}
					onClick={handleHelpButtonClick}
				>
					{__('Help', 'pojo-accessibility')}
				</Button>
				<IconButton {...bindTrigger(accountMenuState)}>
					<UserIcon
						role="img"
						aria-label={__('My Account', 'pojo-accessibility')}
						sx={{ color: 'common.black' }}
						fontSize="small"
					/>
				</IconButton>
			</Box>
			<PopupMenu
				{...bindMenu(accountMenuState)}
				closeAction={accountMenuState.close}
			/>
			{isSidebarOpen && <WhatsNewDrawer onClose={close} />}
		</>
	);
};

export default TopBarMenu;
