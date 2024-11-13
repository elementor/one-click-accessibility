import { ThemeProvider } from '@elementor/ui/styles';
import { StrictMode, Fragment, createRoot } from '@wordpress/element';
import App from './app';
import AdminTopBar from './components/admin-top-bar';
import { PluginSettingsProvider } from './contexts/plugin-settings';
import { SettingsProvider, NotificationsProvider } from './hooks';

const rootNode = document.getElementById( 'ea11y-app' );
const topBarNode = document.getElementById( 'ea11y-app-top-bar' );

// Can't use the settings hook in the global scope so accessing directly
const isDevelopment = window?.ea11ySettingsData?.isDevelopment;
const AppWrapper = Boolean( isDevelopment ) ? StrictMode : Fragment;

const root = createRoot( rootNode );
const topBar = createRoot( topBarNode );

root.render(
	<AppWrapper>
		<NotificationsProvider>
			<SettingsProvider>
				<PluginSettingsProvider>
					<App />
				</PluginSettingsProvider>
			</SettingsProvider>
		</NotificationsProvider>
	</AppWrapper>,
);
