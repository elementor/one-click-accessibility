import '../css/style.css';
import DirectionProvider from '@elementor/ui/DirectionProvider';
import { ThemeProvider } from '@elementor/ui/styles';
import { ConnectModal, Notifications } from './components';
import { usePluginSettingsContext } from './contexts/plugin-settings';
import { useNotificationSettings } from './hooks';

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
				<Notifications message={ notificationMessage } type={ notificationType } />
			</ThemeProvider>
		</DirectionProvider>
	);
};

export default App;
