import '../css/style.css';
import Box from '@elementor/ui/Box';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import Grid from '@elementor/ui/Grid';
import { ThemeProvider } from '@elementor/ui/styles';
import {
	ConnectModal,
	Notifications,
	MenuItems,
	AdminTopBar,
	PostConnectModal,
} from '@ea11y/components';
import {
	useNotificationSettings,
	useSettings,
	useSavedSettings,
} from '@ea11y/hooks';
import { Sidebar } from '@ea11y/layouts';
import { mixpanelService } from '@ea11y/services';
import { useEffect } from '@wordpress/element';
import { usePluginSettingsContext } from './contexts/plugin-settings';

const App = () => {
	useSavedSettings();
	const { isConnected, isRTL, closePostConnectModal } =
		usePluginSettingsContext();
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { selectedMenu } = useSettings();

	useEffect(() => {
		mixpanelService.init();
		mixpanelService.sendEvent('Page View', {
			page: 'Design & position',
		});
	}, []);

	// Accessing the selected menu item
	const selectedParent = MenuItems[selectedMenu.parent];
	const selectedChild = selectedMenu.child
		? selectedParent.children[selectedMenu.child]
		: null;
	return (
		<DirectionProvider rtl={isRTL}>
			<ThemeProvider colorScheme="light">
				{isConnected !== undefined && !isConnected && <ConnectModal />}
				{isConnected && !closePostConnectModal && <PostConnectModal />}
				<Grid display="flex" flexDirection="row" height="100%">
					<Sidebar />
					<Box
						width="100%"
						display="flex"
						flexDirection="column"
						justifyContent="start"
					>
						<AdminTopBar />
						{selectedChild ? selectedChild.page : selectedParent?.page}
					</Box>
				</Grid>
				<Notifications message={notificationMessage} type={notificationType} />
			</ThemeProvider>
		</DirectionProvider>
	);
};

export default App;
