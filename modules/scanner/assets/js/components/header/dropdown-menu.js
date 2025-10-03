import CalendarDollarIcon from '@elementor/icons/CalendarDollarIcon';
import ChecklistIcon from '@elementor/icons/ChecklistIcon';
import ClearIcon from '@elementor/icons/ClearIcon';
import DotsHorizontalIcon from '@elementor/icons/DotsHorizontalIcon';
import ExternalLinkIcon from '@elementor/icons/ExternalLinkIcon';
import RefreshIcon from '@elementor/icons/RefreshIcon';
import ThemeBuilderIcon from '@elementor/icons/ThemeBuilderIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemIcon from '@elementor/ui/MenuItemIcon';
import MenuItemText from '@elementor/ui/MenuItemText';
import { ELEMENTOR_URL } from '@ea11y-apps/global/constants';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import useScannerSettings from '@ea11y-apps/scanner/hooks/use-scanner-settings';
import { DisabledMenuItemText } from '@ea11y-apps/scanner/styles/app.styles';
import { areNoHeadingsDefined } from '@ea11y-apps/scanner/utils/page-headings';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const DropdownMenu = () => {
	const { remediations, isManage, openedBlock, setOpenedBlock, runNewScan } =
		useScannerWizardContext();
	const { dashboardUrl } = useScannerSettings();
	const { error } = useToastNotification();
	const [isOpened, setIsOpened] = useState(false);
	const [loading, setLoading] = useState(false);
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

	const onClearCache = async () => {
		try {
			setLoading(true);
			await APIScanner.clearCache({
				url: window.ea11yScannerData?.pageData?.url,
			});
			sendOnClickEvent('Clear cache');
			handleClose();
		} catch (e) {
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const goToHeadingManager = () => {
		handleClose();
		setOpenedBlock(BLOCKS.headingStructure);
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

				<MenuItem
					component="a"
					href={dashboardUrl}
					onClick={() => sendOnClickEvent('View all scans')}
					dense
				>
					<MenuItemIcon>
						<ChecklistIcon />
					</MenuItemIcon>
					<MenuItemText>
						{__('View all scans', 'pojo-accessibility')}
					</MenuItemText>
				</MenuItem>

				{remediations.length > 0 ? (
					<MenuItem
						onClick={onClearCache}
						loading={loading}
						disabled={loading}
						dense
					>
						<MenuItemIcon>
							<ClearIcon />
						</MenuItemIcon>

						<MenuItemText>
							{__('Clear cache', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				) : (
					<MenuItem dense>
						<MenuItemIcon>
							<ClearIcon color="disabled" />
						</MenuItemIcon>
						<DisabledMenuItemText>
							{__('Clear page cache', 'pojo-accessibility')}
						</DisabledMenuItemText>
					</MenuItem>
				)}

				{!areNoHeadingsDefined() && (
					<MenuItem
						onClick={goToHeadingManager}
						dense
						disabled={isManage && BLOCKS.headingStructure === openedBlock}
						selected={isManage && BLOCKS.headingStructure === openedBlock}
					>
						<MenuItemIcon>
							<ThemeBuilderIcon />
						</MenuItemIcon>

						<MenuItemText>
							{__('Manage headings', 'pojo-accessibility')}
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
