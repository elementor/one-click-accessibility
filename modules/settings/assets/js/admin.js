import { SettingsProvider, NotificationsProvider } from '@ea11y/hooks';
import { StrictMode, Fragment, createRoot } from '@wordpress/element';
import App from './app';
import { AnalyticsContextProvider } from './contexts/analytics-context';
import { PluginSettingsProvider } from './contexts/plugin-settings';
import { initNoticeRelocation } from './utils/move-notices';

const rootNode = document.getElementById('ea11y-app');

// Can't use the settings hook in the global scope so accessing directly
const isDevelopment = window?.ea11ySettingsData?.isDevelopment;
const AppWrapper = Boolean(isDevelopment) ? StrictMode : Fragment;

if (rootNode) {
	const root = createRoot(rootNode);

	root.render(
		<AppWrapper>
			<NotificationsProvider>
				<SettingsProvider>
					<PluginSettingsProvider>
						<AnalyticsContextProvider>
							<App />
						</AnalyticsContextProvider>
					</PluginSettingsProvider>
				</SettingsProvider>
			</NotificationsProvider>
		</AppWrapper>,
	);

	// Move WordPress admin notices into the React app after rendering starts
	initNoticeRelocation();
}
