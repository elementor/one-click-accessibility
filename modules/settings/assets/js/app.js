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
} from '@ea11y/components';
import {
	useNotificationSettings,
	useSettings,
	useSavedSettings,
} from '@ea11y/hooks';
import { usePluginSettingsContext } from './contexts/plugin-settings';
import { Sidebar } from './layouts/sidebar';

const App = () => {
	const { isConnected } = usePluginSettingsContext();
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { selectedMenu } = useSettings();
        useSavedSettings();
        const { isConnected } = usePluginSettingsContext();
	const { notificationMessage, notificationType } = useNotificationSettings();
	const { selectedMenu } = useSettings();

	// Accessing the selected menu item
	const selectedParent = MenuItems[selectedMenu.parent];
	const selectedChild = selectedMenu.child
		? selectedParent.children[selectedMenu.child]
		: null;
	return (
		<DirectionProvider rtl={false /* TODO:Add RTL detection in settings */}>
			<ThemeProvider colorScheme="light">
				{!isConnected && <ConnectModal />}
				<Grid display="flex" flexDirection="row" height="100%">
					<Sidebar />
					<Box
						width="100%"
						display="flex"
						flexDirection="column"
						justifyContent="space-between"
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
