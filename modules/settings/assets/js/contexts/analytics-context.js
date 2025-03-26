import { useStorage } from '@ea11y/hooks';
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';
import API from '../api';

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

	/**
	 * Get initial logs list
	 */
	useEffect(() => {
		if (isProVersion) {
			setLoading(true);
			void API.getStatistic({ period }).then((data) => {
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

	return (
		<AnalyticsContext.Provider
			value={{
				isAnalyticsEnabled,
				setIsAnalyticsEnabled,
				isProVersion,
				setIsProVersion,
				updateIsAnalyticsEnabled,
				period,
				setPeriod,
				stats,
				loading,
			}}
		>
			{children}
		</AnalyticsContext.Provider>
	);
};

export const useAnalyticsContext = () => {
	return useContext(AnalyticsContext);
};
