import '../css/style.css';
import Box from '@elementor/ui/Box';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import Grid from '@elementor/ui/Grid';
import { ThemeProvider } from '@elementor/ui/styles';
import { ConnectModal, Notifications, MenuItems, AdminTopBar, BottomBar } from './components';
import { usePluginSettingsContext } from './contexts/plugin-settings';
import { useNotificationSettings, useSettings } from './hooks';
import { Sidebar } from './layouts/sidebar';

const App = () => {
	const { isConnected } = usePluginSettingsContext();
	const {
		notificationMessage,
		notificationType,
	} = useNotificationSettings();
	const { selectedMenu } = useSettings();

	// Accessing the selected menu item
	const selectedParent = MenuItems[ selectedMenu.parent ];
	const selectedChild = selectedMenu.child ? selectedParent.children[ selectedMenu.child ] : null;
	return (
		<DirectionProvider rtl={ false /* TODO:Add RTL detection in settings */ }>
			<ThemeProvider colorScheme="light">
				{ ! isConnected && <ConnectModal /> }
				<Grid display="flex"
					flexDirection="row"
					height="100%">
					<Sidebar />
					<Box width="100%">
						<AdminTopBar />
						{ selectedChild ? selectedChild.page : selectedParent?.page }
						<BottomBar />
					</Box>
				</Grid>
				<Notifications message={ notificationMessage } type={ notificationType } />
			</ThemeProvider>
		</DirectionProvider>
	);
};

export default App;
