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
import Tooltip from '@elementor/ui/Tooltip';
import { ELEMENTOR_URL } from '@ea11y-apps/global/constants';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { DisabledMenuItemText } from '@ea11y-apps/scanner/styles/app.styles';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const DropdownMenu = () => {
	const { remediations, isManage, setOpenedBlock, setIsManage, runNewScan } =
		useScannerWizardContext();
	const [isOpened, setIsOpened] = useState(false);
	const anchorEl = useRef(null);

	const handleOpen = () => {
		setIsOpened(true);
		mixpanelService.sendEvent(mixpanelEvents.assistantMenuClicked);
	};
	const handleClose = () => setIsOpened(false);

	const sendOnClickEvent = (action) => {
		mixpanelService.sendEvent(mixpanelEvents.assistantMenuOptionSelected, {
			action,
		});
	};

	const onRescan = () => {
		runNewScan();
		sendOnClickEvent('Rescan');
	};

	const goToManagement = () => {
		handleClose();
		setIsManage(true);
		setOpenedBlock(BLOCKS.management);
		sendOnClickEvent('Manage fixes');
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
				onClose={handleClose}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				MenuListProps={{
					'aria-labelledby': 'menu-button',
				}}
				PaperProps={{
					style: {
						overflow: 'visible',
					},
				}}
				disablePortal
			>
				<MenuItem onClick={onRescan} dense>
					<MenuItemIcon>
						<RefreshIcon />
					</MenuItemIcon>

					<MenuItemText>{__('Rescan', 'pojo-accessibility')}</MenuItemText>
				</MenuItem>

				{!remediations.length ? (
					<Tooltip
						arrow
						placement="left"
						title={__(
							'You don’t have any fixes to manage just yet.',
							'pojo-accessibility',
						)}
						PopperProps={{
							disablePortal: true,
							modifiers: [
								{
									name: 'offset',
									options: {
										offset: [0, -16],
									},
								},
							],
						}}
					>
						<MenuItem dense>
							<MenuItemIcon>
								<SettingsIcon color="disabled" />
							</MenuItemIcon>
							<DisabledMenuItemText>
								{__('Manage fixes', 'pojo-accessibility')}
							</DisabledMenuItemText>
						</MenuItem>
					</Tooltip>
				) : (
					<MenuItem
						onClick={goToManagement}
						disabled={isManage}
						selected={isManage}
						dense
					>
						<MenuItemIcon>
							<SettingsIcon />
						</MenuItemIcon>
						<MenuItemText>
							{__('Manage fixes', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				)}

				<MenuItem
					component="a"
					href={ELEMENTOR_URL}
					target="_blank"
					rel="noreferrer"
					onClick={() => sendOnClickEvent('View subscription')}
					dense
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
