import ChevronDownSmallIcon from '@elementor/icons/ChevronDownSmallIcon';
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
			<ParentMenuButton
				onClick={() =>
					hasChildItems
						? handleToggleItem(item.name, key)
						: handleSelectedMenu(item.name, key)
				}
				selected={
					key === selectedMenu?.parent &&
					(!selectedMenu?.child || isSidebarCollapsed)
				}
			>
				<Tooltip
					title={item?.name}
					placement="right"
					disableHoverListener={openSidebar || hasChildItems}
				>
					<MenuItemIconWrapper
						aria-hidden={!isSidebarCollapsed}
						isSidebarCollapsed={isSidebarCollapsed}
					>
						{item.icon}
					</MenuItemIconWrapper>
				</Tooltip>

				{!isSidebarCollapsed && (
					<>
						<MenuItemText primary={item.name} />

						{!showProIcon(item) && item?.infotip}

						{showProIcon(item) && (
							<StyledChip
								color="promotion"
								variant="standard"
								icon={<CrownFilled size="tiny" />}
							/>
						)}

						{hasChildItems && (
							<Rotate in={!isItemExpanded}>
								<ChevronDownSmallIcon />
							</Rotate>
						)}
					</>
				)}
			</ParentMenuButton>

			{hasChildItems && (
				<PopupChildrenContainer
					isSidebarCollapsed={isSidebarCollapsed}
					isItemExpanded={isItemExpanded}
					popupPosition={popupPosition}
				>
					{isSidebarCollapsed && <CollapsedMenuTitle primary={item.name} />}
					<List disablePadding>
						{Object.entries(item?.children).map(([childKey, child]) => (
							<ChildListItem key={childKey} dense>
								<ChildMenuButton
									isSidebarCollapsed={isSidebarCollapsed}
									selected={childKey === selectedMenu?.child}
									onClick={() => handleSelectedMenu(child.name, key, childKey)}
								>
									<ChildMenuText primary={child?.name} />

									{!showProIcon(child) && child?.infotip}

									{showProIcon(child) && (
										<StyledChip
											color="promotion"
											variant="standard"
											icon={<CrownFilled size="tiny" />}
										/>
									)}
								</ChildMenuButton>
							</ChildListItem>
						))}
					</List>
				</PopupChildrenContainer>
			)}
		</ListItemContainer>
	);
};

export default SidebarMenuItem;

const ParentMenuButton = styled(ListItemButton)`
	justify-content: center;
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

const MenuItemIconWrapper = styled(ListItemIcon, {
	shouldForwardProp: (prop) => prop !== 'isSidebarCollapsed',
})`
	/* For smoother sidebar */
	padding: ${({ isSidebarCollapsed, theme }) =>
		isSidebarCollapsed ? theme.spacing(0.5) : 'auto'};
	margin-inline-end: ${({ isSidebarCollapsed, theme }) =>
		isSidebarCollapsed ? '0 !important' : theme.spacing(1)};
`;

const MenuItemText = styled(ListItemText)`
	text-align: start;
	white-space: nowrap;
`;

const ChildListItem = styled(ListItem)`
	padding: 0;
`;

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

const CollapsedMenuTitle = styled(ListItemText)`
	color: ${({ theme }) => theme.palette.text.secondary};
	padding: ${({ theme }) => theme.spacing(1, 2)};
	margin: 0;
	text-align: start;
`;

const ChildMenuButton = styled(ListItemButton, {
	shouldForwardProp: (prop) => prop !== 'isSidebarCollapsed',
})`
	color: ${({ isSidebarCollapsed, theme }) =>
		isSidebarCollapsed
			? theme.palette.text.primary
			: theme.palette.text.secondary};
	padding-inline-start: ${({ isSidebarCollapsed, theme }) =>
		isSidebarCollapsed ? theme.spacing(2) : theme.spacing(6)};
	border-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

const ChildMenuText = styled(ListItemText)`
	text-align: start;
	white-space: nowrap;
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
