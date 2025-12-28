import List from '@elementor/ui/List';
import { MenuItems, MenuItem } from '@ea11y/components';

const SidebarMenu = () => {
	return (
		<List disablePadding>
			{Object.entries(MenuItems).map(([key, item]) => (
				<MenuItem key={key} keyName={key} item={item} />
			))}
		</List>
	);
};

export default SidebarMenu;
