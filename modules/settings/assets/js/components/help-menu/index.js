import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import HelpIcon from '@elementor/icons/HelpIcon';
import Button from '@elementor/ui/Button';
import {
	bindMenu,
	bindTrigger,
	usePopupState,
} from '@elementor/ui/usePopupState';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { HelpPopupMenu } from './popup-menu';

const HelpMenu = () => {
	const helpMenuState = usePopupState({
		variant: 'popover',
		popupId: 'helpMenu',
	});

	const triggerProps = bindTrigger(helpMenuState);
	const handleHelpButtonClick = (e) => {
		triggerProps.onClick(e);
		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: 'Help',
		});
	};

	return (
		<>
			<Button
				{...triggerProps}
				size="medium"
				color="secondary"
				aria-label={__('Help', 'pojo-accessibility')}
				startIcon={
					<HelpIcon
						role="presentation"
						sx={{ color: 'common.black' }}
						fontSize="small"
					/>
				}
				endIcon={
					<ChevronDownIcon
						role="presentation"
						sx={{ color: 'common.black' }}
						fontSize="small"
					/>
				}
				onClick={handleHelpButtonClick}
			>
				{__('Help', 'pojo-accessibility')}
			</Button>

			<HelpPopupMenu
				{...bindMenu(helpMenuState)}
				closeAction={helpMenuState.close}
			/>
		</>
	);
};

export default HelpMenu;
