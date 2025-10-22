import ChevronDownIcon from '@elementor/icons/ChevronDownIcon';
import Chip from '@elementor/ui/Chip';
import List from '@elementor/ui/List';
import ListItem from '@elementor/ui/ListItem';
import ListItemButton from '@elementor/ui/ListItemButton';
import ListItemIcon from '@elementor/ui/ListItemIcon';
import ListItemText from '@elementor/ui/ListItemText';
import ListSubheader from '@elementor/ui/ListSubheader';
import Tooltip from '@elementor/ui/Tooltip';
import { styled } from '@elementor/ui/styles';
import { useSettings } from '@ea11y/hooks';
import CrownFilled from '@ea11y-apps/global/icons/crown-filled';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { Fragment, useState } from '@wordpress/element';

const MenuItem = ({ keyName, item }) => {
	const { openSidebar, selectedMenu, setSelectedMenu, planData } =
		useSettings();
	const [expandedItems, setExpandedItems] = useState({ widget: true });
	const key = keyName;

	const proFeatures = planData?.plan?.features
		? Object.keys(planData.plan.features).filter(
				(k) =>
					Boolean(planData.plan.features[k]) &&
					planData.plan.features[k] !== 'false',
			)
		: null;

	const handleSelectedMenu = (itemName, parentKey, childKey) => {
		if (childKey) {
			setSelectedMenu({ parent: parentKey, child: childKey });
		} else {
			setSelectedMenu({ parent: parentKey, child: null });
		}

		window.location.hash = parentKey;

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

	if (item?.type === 'heading' && openSidebar) {
		return (
			<ListSubheader sx={{ whiteSpace: 'nowrap' }}>{item?.name}</ListSubheader>
		);
	} else if (item?.type === 'heading' && !openSidebar) {
		return null;
	}

	return (
		<Fragment key={item?.key}>
			<ListItem disableGutters disablePadding dense>
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
					<Tooltip
						title={item?.name}
						placement="right"
						disableHoverListener={openSidebar}
					>
						<ListItemIcon
							sx={{
								/* For smoother sidebar */
								padding: openSidebar ? 'auto' : 0.5,
								marginRight: openSidebar ? 1 : '0 !important',
							}}
						>
							{item.icon}
						</ListItemIcon>
					</Tooltip>

					<ListItemText primary={item.name} hidden={!openSidebar} />

					{
						/* Show infotip */
						openSidebar && !showProIcon(item) && item?.infotip
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
					{showProIcon(item) && openSidebar && (
						<ListItemIcon>
							<StyledChip
								color="promotion"
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
						<ListItem key={childKey} hidden={!openSidebar} sx={{ p: 0 }} dense>
							<ListItemButton
								sx={{ paddingLeft: '44px', borderRadius: 1 }}
								hidden={!openSidebar}
								selected={childKey === selectedMenu?.child && openSidebar}
								onClick={() => handleSelectedMenu(child.name, key, childKey)}
							>
								<ListItemText primary={child?.name} hidden={!openSidebar} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			)}
		</Fragment>
	);
};

export default MenuItem;

const StyledChip = styled(Chip)`
	height: 26px;
	width: 26px;

	.MuiChip-label {
		padding: 0;
	}
`;
