import Box from '@elementor/ui/Box';
import Divider from '@elementor/ui/Divider';
import Drawer from '@elementor/ui/Drawer';
import { MyAccountMenu, SidebarAppBar, SidebarMenu } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { QuotaBar } from '@ea11y/layouts';

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
					width: !openSidebar ? '120px' : '260px',
					transition: 'all 0.3s',
					height: '100%',
					justifyContent: 'space-between',
					paddingTop: 0,
				},
			}}
		>
			<Box padding={1.5}>
				<SidebarAppBar />
				<SidebarMenu />
			</Box>
			<Box>
				<Divider />
				<QuotaBar />
				<Divider />

				<MyAccountMenu drawerState={openSidebar} />
			</Box>
		</Drawer>
	);
};

export default Sidebar;
