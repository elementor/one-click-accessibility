import Box from '@elementor/ui/Box';
import Drawer from '@elementor/ui/Drawer';
import { MyAccountMenu, SidebarAppBar, SidebarMenu } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';

const Sidebar = () => {
	const { openSidebar } = useSettings();

	return (
		<Drawer
			variant="permanent"
			open={openSidebar}
			sx={{ width: 'auto' }}
			PaperProps={{
				sx: {
					position: 'relative',
					minWidth: '120px',
					maxWidth: '300px',
					width: openSidebar ? '100%' : '0',
					transition: 'all 0.3s',
					height: '100%',
					justifyContent: 'space-between',
					padding: 1.5,
					paddingTop: 0,
				},
			}}
		>
			<Box>
				<SidebarAppBar />
				<SidebarMenu />
			</Box>

			<MyAccountMenu drawerState={openSidebar} />
		</Drawer>
	);
};

export default Sidebar;
