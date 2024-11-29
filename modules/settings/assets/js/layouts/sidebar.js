import Box from '@elementor/ui/Box';
import Drawer from '@elementor/ui/Drawer';
import { MyAccountMenu, SidebarAppBar, SidebarMenu } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';

export const Sidebar = () => {
	const { openSidebar } = useSettings();

	return (
		<Drawer
			variant="permanent"
			open={openSidebar}
			PaperProps={{
				sx: {
					position: 'relative',
					minWidth: '90px',
					maxWidth: '260px',
					width: openSidebar ? '100%' : '0',
					transition: 'all 0.3s',
					height: '100%',
					justifyContent: 'space-between',
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
