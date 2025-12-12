import ChevronUpIcon from '@elementor/icons/ChevronUpIcon';
import Chip from '@elementor/ui/Chip';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import Rotate from '@elementor/ui/Rotate';
import Tooltip from '@elementor/ui/Tooltip';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useRef, useState } from '@wordpress/element';

const SidebarMenuItem = ({ keyName, item }) => {
	const { openSidebar, selectedMenu, setSelectedMenu, planData } =
		useSettings();
	const [expandedItems, setExpandedItems] = useState({ widget: true });
	const [popupPosition, setPopupPosition] = useState({
		popupPositionAbove: 0,
		popupPositionBefore: 0,
	});
	const menuItemRef = useRef(null);
	const key = keyName;

	const proFeatures = planData?.plan?.features
		? Object.keys(planData.plan.features).filter(
				(k) =>
					Boolean(planData.plan.features[k]) &&
					planData.plan.features[k] !== 'false',
			)
		: null;

	const handleSelectedMenu = (itemName, parentKey, childKey) => {
		setSelectedMenu({ parent: parentKey, child: childKey ? childKey : null });

		window.location.hash = childKey ? childKey : parentKey;

		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: childKey || parentKey,
		});
	};

	const handleToggleItem = (itemName, itemKey) => {
		setExpandedItems((prev) => ({
			...prev,
			[itemKey]: !prev[itemKey], // Toggle the expanded state for the clicked item
		}));
		mixpanelService.sendEvent(mixpanelEvents.menuButtonClicked, {
			buttonName: itemKey,
		});
	};

	const showProIcon = (menuItem) =>
		proFeatures && menuItem.proIcon && !proFeatures.includes(menuItem.proIcon);

	const updatePopupPosition = () => {
		if (menuItemRef.current && !openSidebar && item?.children) {
			const rect = menuItemRef.current.getBoundingClientRect();
			const isRTL = document.dir === 'rtl';
			setPopupPosition({
				popupPositionAbove: rect.top,
				// For RTL, calculate distance from the right edge of viewport
				popupPositionBefore: isRTL
					? window.innerWidth - rect.left + 2
					: rect.right + 2,
			});
		}
	};

	const isSidebarCollapsed = !openSidebar;
	const hasChildItems = !!item?.children;
	const isItemExpanded = expandedItems[key];
	const shouldShowProIcon = showProIcon(item);

	return (
		<ListItemContainer
			ref={menuItemRef}
			key={item?.key}
			hasChildItems={hasChildItems}
			isSidebarCollapsed={isSidebarCollapsed}
			disableGutters
			disablePadding
			dense
			onMouseEnter={updatePopupPosition}
			onFocus={updatePopupPosition}
		>
			<ListItemButton
				onClick={() =>
					hasChildItems
						? handleToggleItem(item.name, key)
						: handleSelectedMenu(item.name, key)
				}
				selected={
					key === selectedMenu?.parent &&
					(!selectedMenu?.child || isSidebarCollapsed)
				}
				sx={{ justifyContent: 'center', borderRadius: 1 }}
			>
				<Tooltip
					title={item?.name}
					placement="right"
					disableHoverListener={openSidebar || hasChildItems}
				>
					<ListItemIcon
						aria-hidden={!isSidebarCollapsed}
						sx={{
							/* For smoother sidebar */
							padding: isSidebarCollapsed ? 0.5 : 'auto',
							marginInlineEnd: isSidebarCollapsed ? '0 !important' : 1,
						}}
					>
						{item.icon}
					</ListItemIcon>
				</Tooltip>

				<ListItemText
					primary={item.name}
					hidden={isSidebarCollapsed}
					sx={{
						textAlign: 'start',
						whiteSpace: 'nowrap',
					}}
				/>

				{
					/* Show infotip */
					openSidebar && !showProIcon(item) && item?.infotip
				}

				{hasChildItems && (
					<ListItemIcon
						sx={{
							display: isSidebarCollapsed ? 'none' : 'default',
							marginInlineStart: 2,
						}}
					>
						<Rotate in={isItemExpanded}>
							<ChevronUpIcon fontSize="small" />
						</Rotate>
					</ListItemIcon>
				)}
				{shouldShowProIcon && !isSidebarCollapsed && (
					<ListItemIcon>
						<StyledChip
							color="promotion"
							variant="standard"
							icon={<CrownFilled size="tiny" />}
						/>
					</ListItemIcon>
				)}
			</ListItemButton>

			{hasChildItems && (
				<PopupChildrenContainer
					isSidebarCollapsed={isSidebarCollapsed}
					isItemExpanded={isItemExpanded}
					popupPosition={popupPosition}
				>
					{isSidebarCollapsed && (
						<ListItemText
							primary={item.name}
							sx={{
								color: '#69727D',
								padding: '8px 16px',
								margin: 0,
								textAlign: 'start',
							}}
						/>
					)}
					<List disablePadding>
						{Object.entries(item?.children).map(([childKey, child]) => (
							<ListItem key={childKey} sx={{ p: 0 }} dense>
								<ListItemButton
									sx={{
										color: isSidebarCollapsed ? '#000' : '#69727D',
										paddingInlineStart: isSidebarCollapsed ? '16px' : '48px',
										borderRadius: 1,
									}}
									selected={childKey === selectedMenu?.child}
									onClick={() => handleSelectedMenu(child.name, key, childKey)}
								>
									<ListItemText
										primary={child?.name}
										sx={{ textAlign: 'start', whiteSpace: 'nowrap' }}
									/>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</PopupChildrenContainer>
			)}
		</ListItemContainer>
	);
};

export default SidebarMenuItem;

const StyledChip = styled(Chip)`
	height: 26px;
	width: 26px;

	.MuiChip-label {
		padding: 0;
	}
`;

const ListItemContainer = styled(ListItem, {
	shouldForwardProp: (prop) =>
		prop !== 'hasChildItems' && prop !== 'isSidebarCollapsed',
})`
	position: relative;
	flex-direction: column;
	align-items: stretch;

	${({ hasChildItems, isSidebarCollapsed }) =>
		hasChildItems &&
		isSidebarCollapsed &&
		`
		&:hover > div:last-child,
		&:focus-within > div:last-child {
			display: block;
		}
	`}
`;

const PopupChildrenContainer = styled('div', {
	shouldForwardProp: (prop) =>
		prop !== 'isSidebarCollapsed' &&
		prop !== 'isItemExpanded' &&
		prop !== 'popupPosition',
})`
	${({ isSidebarCollapsed, isItemExpanded, popupPosition, theme }) => {
		if (isSidebarCollapsed) {
			return `
				display: none;
				position: fixed;
				inset-block-start: ${popupPosition?.popupPositionAbove || 0}px;
				inset-inline-start: ${popupPosition?.popupPositionBefore || 0}px;
				min-width: 200px;
				padding: ${theme.spacing(1)};
				background-color: ${theme.palette.background.paper};
				box-shadow: ${theme.shadows[8]};
				border-radius: ${theme.shape.borderRadius}px;
			`;
		}

		return isItemExpanded ? 'display: block;' : 'display: none;';
	}}
`;
