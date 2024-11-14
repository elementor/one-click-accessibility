import '../css/style.css';
import Container from '@elementor/ui/Container';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import Grid from '@elementor/ui/Grid';
import { ThemeProvider } from '@elementor/ui/styles';
import { ConnectModal, Notifications } from './components';
import { usePluginSettingsContext } from './contexts/plugin-settings';
import { useNotificationSettings } from './hooks';
import { Sidebar } from './layouts/sidebar';

const App = () => {
	const { isConnected } = usePluginSettingsContext();
	const {
		notificationMessage,
		notificationType,
	} = useNotificationSettings();

	return (
		<DirectionProvider rtl={ false /* TODO:Add RTL detection in settings */ }>
			<ThemeProvider colorScheme="light">
				{ ! isConnected && <ConnectModal /> }
				<Grid display="flex"
					flexDirection="row">
					<Sidebar />
					<Container>Page Content</Container>
				</Grid>
				<Notifications message={ notificationMessage } type={ notificationType } />
			</ThemeProvider>
		</DirectionProvider>
	);
};

export default App;
