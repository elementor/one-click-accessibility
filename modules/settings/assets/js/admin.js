import { ThemeProvider } from '@elementor/ui/styles';
import { StrictMode, Fragment, createRoot } from '@wordpress/element';
import App from './app';
import AdminTopBar from './components/admin-top-bar';

const rootNode = document.getElementById( 'ea11y-app' );
const topBarNode = document.getElementById( 'ea11y-app-top-bar' );

// Can't use the settings hook in the global scope so accessing directly
const isDevelopment = window?.ea11ySettingsData?.isDevelopment;
const AppWrapper = Boolean( isDevelopment ) ? StrictMode : Fragment;

const root = createRoot( rootNode );
const topBar = createRoot( topBarNode );

topBar.render(
	<ThemeProvider colorScheme="light">
		<AdminTopBar />
	</ThemeProvider>,
);

root.render(
	<AppWrapper>
		<App />
	</AppWrapper>,
);
