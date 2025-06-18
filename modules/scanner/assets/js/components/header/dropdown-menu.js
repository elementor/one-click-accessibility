import CalendarDollarIcon from '@elementor/icons/CalendarDollarIcon';
import DotsHorizontalIcon from '@elementor/icons/DotsHorizontalIcon';
import ExternalLinkIcon from '@elementor/icons/ExternalLinkIcon';
import RefreshIcon from '@elementor/icons/RefreshIcon';
import SettingsIcon from '@elementor/icons/SettingsIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemIcon from '@elementor/ui/MenuItemIcon';
import MenuItemText from '@elementor/ui/MenuItemText';
import { SUBSCRIPTION_LINK } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const DropdownMenu = () => {
	const { getResults, setOpenedBlock } = useScannerWizardContext();
	const [isOpened, setIsOpened] = useState(false);
	const anchorEl = useRef(null);

	const handleOpen = () => setIsOpened(true);
	const handleClose = () => setIsOpened(false);

	const startNewScan = async () => {
		handleClose();
		setTimeout(async () => {
			setOpenedBlock(BLOCKS.main);
			const summary = await getResults();
			mixpanelService.sendEvent(mixpanelEvents.scanTriggered, {
				page_url: window.ea11yScannerData?.pageData?.url,
				issue_count: summary?.counts?.violation,
				source: 'rescan_button',
			});
		}, 300);
	};

	const goToManagement = () => {
		handleClose();
		setOpenedBlock(BLOCKS.management);
	};

	return (
		<Box>
			<IconButton
				id="menu-button"
				aria-controls={isOpened ? 'assistant-menu' : undefined}
				aria-expanded={isOpened ? 'true' : undefined}
				aria-haspopup="true"
				onClick={handleOpen}
				ref={anchorEl}
				aria-label={__('Menu', 'pojo-accessibility')}
			>
				<DotsHorizontalIcon />
			</IconButton>
			<Menu
				open={isOpened}
				id="assistant-menu"
				anchorEl={anchorEl.current}
				container={anchorEl.current}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'menu-button',
				}}
				disablePortal
			>
				<MenuItem onClick={startNewScan}>
					<MenuItemIcon>
						<RefreshIcon />
					</MenuItemIcon>
					<MenuItemText>{__('New Scan', 'pojo-accessibility')}</MenuItemText>
				</MenuItem>
				<MenuItem onClick={goToManagement}>
					<MenuItemIcon>
						<SettingsIcon />
					</MenuItemIcon>
					<MenuItemText>
						{__('Manage fixes', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>
				<MenuItem
					component="a"
					href={SUBSCRIPTION_LINK}
					target="_blank"
					rel="noreferrer"
				>
					<MenuItemIcon>
						<CalendarDollarIcon />
					</MenuItemIcon>
					<MenuItemText>
						{__('View subscription', 'pojo-accessibility')}
					</MenuItemText>
					<MenuItemIcon sx={{ ml: 5 }}>
						<ExternalLinkIcon />
					</MenuItemIcon>
				</MenuItem>
			</Menu>
		</Box>
	);
};
