import { ChevronDownIcon } from '@elementor/icons';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import { MenuItems } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { mixpanelService } from '@ea11y/services';
import { useState, Fragment } from '@wordpress/element';

const SidebarMenu = () => {
	const { openSidebar, selectedMenu, setSelectedMenu } = useSettings();
	const [expandedItems, setExpandedItems] = useState({ widget: true });

	const handleSelectedMenu = (itemName, parentKey, childKey) => {
		if (childKey) {
			setSelectedMenu({ parent: parentKey, child: childKey });
		} else {
			setSelectedMenu({ parent: parentKey, child: null });
		}

		mixpanelService.sendEvent('menu_button_clicked', {
			buttonName: itemName,
		});
	};

	const handleToggleItem = (itemName, itemKey) => {
		setExpandedItems((prev) => ({
			...prev,
			[itemKey]: !prev[itemKey], // Toggle the expanded state for the clicked item
		}));
		mixpanelService.sendEvent('menu_button_clicked', {
			buttonName: itemName,
		});
	};

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
							<ListItemIcon>{item.icon}</ListItemIcon>

							<ListItemText primary={item.name} hidden={!openSidebar} />

							{/* Show infotip */ item?.infotip}

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

export default SidebarMenu;
