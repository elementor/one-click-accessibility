import { useToastNotification } from '@ea11y-apps/global/hooks';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import APISettings from '../api';

const PluginSettingsContext = createContext({});

export const PluginSettingsProvider = ({ children }) => {
	const { error } = useToastNotification();
	const [pluginSettings, setPluginSettings] = useState();
	const [loaded, setLoaded] = useState(false);

	const refreshPluginSettings = useCallback(() => {
		APISettings.getPluginSettings()
			.then((settings) => {
				if ('isConnected' in settings) {
					settings.isConnected = Boolean(settings.isConnected);
				}

				if ('closePostConnectModal' in settings) {
					settings.closePostConnectModal = Boolean(
						settings.closePostConnectModal,
					);
				}

				if ('closeOnboardingModal' in settings) {
					settings.closeOnboardingModal = Boolean(
						settings.closeOnboardingModal,
					);
				}

				if ('isUrlMismatch' in settings) {
					settings.isUrlMismatch = Boolean(settings.isUrlMismatch);
				}

				if ('unfilteredUploads' in settings) {
					settings.unfilteredUploads = Boolean(settings.unfilteredUploads);
				}

				if ('homeUrl' in settings) {
					settings.homeUrl = settings.homeUrl;
				}

				if ('whatsNewDataHash' in settings) {
					settings.whatsNewDataHash = Boolean(settings.whatsNewDataHash);
				}

				setPluginSettings(settings);
				setLoaded(true);
			})
			.catch(() => {
				error(__('An error occurred.', 'pojo-accessibility'));
				setLoaded(true);
			});
	}, []);

	useEffect(() => {
		refreshPluginSettings();
	}, [refreshPluginSettings]);

	return (
		<PluginSettingsContext.Provider
			value={{ ...pluginSettings, loaded, refreshPluginSettings }}
		>
			{children}
		</PluginSettingsContext.Provider>
	);
};

export const usePluginSettingsContext = () => {
	return useContext(PluginSettingsContext);
};
