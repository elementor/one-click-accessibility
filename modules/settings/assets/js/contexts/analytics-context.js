import { useStorage } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';
import APISettings from '../api';

const AnalyticsContext = createContext(null);

export const AnalyticsContextProvider = ({ children }) => {
	const { save } = useStorage();
	const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(false);
	const [isProVersion, setIsProVersion] = useState(false);
	const [loading, setLoading] = useState(false);
	const [period, setPeriod] = useState(30);
	const [stats, setStats] = useState({
		dates: [],
		elements: [],
	});

	const [showConfirmPopup, setShowConfirmPopup] = useState(false);

	/**
	 * Get initial logs list
	 */
	useEffect(() => {
		if (isProVersion) {
			setLoading(true);
			void APISettings.getStatistic({ period }).then((data) => {
				setStats(data);
				setLoading(false);
			});
		}
	}, [period, isAnalyticsEnabled, isProVersion]);

	const updateIsAnalyticsEnabled = async () => {
		await save({
			ea11y_analytics_enabled: !isAnalyticsEnabled,
		});
		setIsAnalyticsEnabled(!isAnalyticsEnabled);
		setPeriod(30);
	};

	const handleAnalyticsToggle = () => {
		if (isAnalyticsEnabled) {
			updateIsAnalyticsEnabled();
		} else {
			setShowConfirmPopup(true);
		}

		mixpanelService.sendEvent(mixpanelEvents.toggleClicked, {
			state: isAnalyticsEnabled ? 'off' : 'on',
			type: 'Enable analytics',
		});
	};

	return (
		<AnalyticsContext.Provider
			value={{
				isAnalyticsEnabled,
				setIsAnalyticsEnabled,
				isProVersion,
				setIsProVersion,
				updateIsAnalyticsEnabled,
				handleAnalyticsToggle,
				period,
				setPeriod,
				stats,
				loading,
				showConfirmPopup,
				setShowConfirmPopup,
			}}
		>
			{children}
		</AnalyticsContext.Provider>
	);
};

export const useAnalyticsContext = () => {
	return useContext(AnalyticsContext);
};
