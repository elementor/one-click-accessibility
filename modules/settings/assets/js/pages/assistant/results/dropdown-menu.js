import DotsHorizontalIcon from '@elementor/icons/DotsHorizontalIcon';
import RefreshIcon from '@elementor/icons/RefreshIcon';
import SettingsIcon from '@elementor/icons/SettingsIcon';
import Box from '@elementor/ui/Box';
import IconButton from '@elementor/ui/IconButton';
import Menu from '@elementor/ui/Menu';
import MenuItem from '@elementor/ui/MenuItem';
import MenuItemIcon from '@elementor/ui/MenuItemIcon';
import MenuItemText from '@elementor/ui/MenuItemText';
import Tooltip from '@elementor/ui/Tooltip';
import PropTypes from 'prop-types';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { DisabledMenuItemText } from '@ea11y-apps/scanner/styles/app.styles';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

export const DropdownMenu = ({ pageUrl, remediationCount }) => {
	const [isOpened, setIsOpened] = useState(false);
	const anchorEl = useRef(null);

	const ctaScan = addQueryArgs(pageUrl, {
		'open-ea11y-assistant': '1',
		'open-ea11y-assistant-src': 'Ally_dashboard',
	});

	const ctaManage = addQueryArgs(pageUrl, {
		'open-ea11y-manage': '1',
		'open-ea11y-assistant-src': 'Ally_dashboard',
	});

	const handleOpen = () => setIsOpened(true);
	const handleClose = () => setIsOpened(false);

	const sendOnClickEvent = (action) => {
		mixpanelService.sendEvent(mixpanelEvents.scanLogActionsButtonClicked, {
			action,
		});
	};

	const onRunNewScan = () => {
		sendOnClickEvent('scan');
	};

	const goToManagement = () => {
		handleClose();
		sendOnClickEvent('manage fixes');
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
				PaperProps={{
					style: {
						overflow: 'visible',
					},
				}}
				disablePortal
			>
				<MenuItem
					component="a"
					href={ctaScan}
					target="_blank"
					rel="noreferrer"
					onClick={onRunNewScan}
				>
					<MenuItemIcon>
						<RefreshIcon />
					</MenuItemIcon>
					<MenuItemText>{__('New Scan', 'pojo-accessibility')}</MenuItemText>
				</MenuItem>
				{remediationCount < 1 ? (
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
						<MenuItem>
							<MenuItemIcon>
								<SettingsIcon color="disabled" />
							</MenuItemIcon>
							<DisabledMenuItemText>
								{__('Manage AI fixes', 'pojo-accessibility')}
							</DisabledMenuItemText>
						</MenuItem>
					</Tooltip>
				) : (
					<MenuItem
						component="a"
						href={ctaManage}
						target="_blank"
						rel="noreferrer"
						onClick={goToManagement}
					>
						<MenuItemIcon>
							<SettingsIcon />
						</MenuItemIcon>
						<MenuItemText>
							{__('Manage AI fixes', 'pojo-accessibility')}
						</MenuItemText>
					</MenuItem>
				)}
			</Menu>
		</Box>
	);
};

DropdownMenu.propTypes = {
	pageUrl: PropTypes.string.isRequired,
	remediationCount: PropTypes.number.isRequired,
};
