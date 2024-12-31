import { useToastNotification } from '@ea11y/hooks';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import API from '../api';

const PluginSettingsContext = createContext({});

export const PluginSettingsProvider = ({ children }) => {
	const { error } = useToastNotification();
	const [pluginSettings, setPluginSettings] = useState();
	const [loaded, setLoaded] = useState(false);

	const refreshPluginSettings = useCallback(() => {
		API.getPluginSettings()
			.then((settings) => {
				if ('isConnected' in settings) {
					settings.isConnected = Boolean(settings.isConnected);
				}

				if ('closePostConnectModal' in settings) {
					settings.closePostConnectModal = Boolean(
						settings.closePostConnectModal,
					);
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
