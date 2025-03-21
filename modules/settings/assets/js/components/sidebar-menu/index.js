import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import { Chip } from '@elementor/ui';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import { styled } from '@elementor/ui/styles';
import { MenuItems } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import CrownFilled from '@ea11y/icons/crown-filled';
import { eventNames, mixpanelService } from '@ea11y/services';
import { useState, Fragment } from '@wordpress/element';

const SidebarMenu = () => {
	const { openSidebar, selectedMenu, setSelectedMenu, planData } =
		useSettings();
	const [expandedItems, setExpandedItems] = useState({ widget: true });
	const proFeatures = planData?.plan?.features
		? Object.keys(planData.plan.features).filter(
				(key) =>
					Boolean(planData.plan.features[key]) &&
					planData.plan.features[key] !== 'false',
			)
		: null;

	const handleSelectedMenu = (itemName, parentKey, childKey) => {
		if (childKey) {
			setSelectedMenu({ parent: parentKey, child: childKey });
		} else {
			setSelectedMenu({ parent: parentKey, child: null });
		}

		window.location.hash = parentKey;

		mixpanelService.sendEvent(eventNames.menuButtonClicked, {
			buttonName: itemName,
		});
	};

	const handleToggleItem = (itemName, itemKey) => {
		setExpandedItems((prev) => ({
			...prev,
			[itemKey]: !prev[itemKey], // Toggle the expanded state for the clicked item
		}));
		mixpanelService.sendEvent(eventNames.menuButtonClicked, {
			buttonName: itemName,
		});
	};

	const showProIcon = (item) =>
		proFeatures && item.proIcon && !proFeatures.includes(item.proIcon);

	return (
		<List sx={{ paddingTop: 2.5 }}>
			{Object.entries(MenuItems).map(([key, item]) => (
				<Fragment key={item?.key}>
					<ListItem disableGutters disablePadding>
						<ListItemButton
							onClick={() =>
								item?.children
									? handleToggleItem(item.name, key)
									: handleSelectedMenu(item.name, key)
							}
							sx={{ justifyContent: 'center', borderRadius: 1 }}
							selected={
								key === selectedMenu?.parent &&
								(!selectedMenu?.child || !openSidebar)
							}
						>
							<ListItemIcon
								sx={{
									/*For smoother sidebar*/ padding: openSidebar
										? 'auto'
										: '4px',
								}}
							>
								{item.icon}
							</ListItemIcon>

							<ListItemText primary={item.name} hidden={!openSidebar} />

							{
								/* Show infotip */
								openSidebar && item?.infotip
							}

							{item?.children && (
								<ListItemIcon
									sx={{
										display: !openSidebar ? 'none' : 'default',
										marginLeft: 2,
									}}
								>
									<ChevronDownIcon
										fontSize="small"
										sx={{ rotate: expandedItems[key] ? '180deg' : '0' }}
									/>
								</ListItemIcon>
							)}
							{showProIcon(item) && (
								<ListItemIcon>
									<StyledChip
										color="accent"
										variant="standard"
										icon={<CrownFilled size="tiny" />}
									/>
								</ListItemIcon>
							)}
						</ListItemButton>
					</ListItem>

					{item?.children && expandedItems[key] && openSidebar && (
						<List disablePadding>
							{Object.entries(item?.children).map(([childKey, child]) => (
								<ListItem
									key={childKey}
									hidden={!openSidebar}
									sx={{ p: 0 }}
									dense
								>
									<ListItemButton
										sx={{ paddingLeft: '44px', borderRadius: 1 }}
										hidden={!openSidebar}
										selected={childKey === selectedMenu?.child && openSidebar}
										onClick={() =>
											handleSelectedMenu(child.name, key, childKey)
										}
									>
										<ListItemText primary={child?.name} hidden={!openSidebar} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
					)}
				</Fragment>
			))}
		</List>
	);
};

const StyledChip = styled(Chip)`
	height: 26px;
	width: 26px;
	border-radius: 50%;
	justify-content: space-around;
`;

export default SidebarMenu;
