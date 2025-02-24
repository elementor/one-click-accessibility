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
	const [showAnalytics, setShowAnalytics] = useState(false);
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
		setLoading(true);
		const date = new Date();
		date.setDate(date.getDate() - period);
		date.setHours(0, 0, 0, 0);
		const params = {
			period: date.toISOString().slice(0, 19).replace('T', ' '),
		};
		void API.getStatistic(params).then((data) => {
			setStats(data);
			setLoading(false);
		});
	}, [period, showAnalytics]);

	const updateShowAnalytics = async () => {
		await save({
			ea11y_analytics_enabled: !showAnalytics,
		});
		setShowAnalytics(!showAnalytics);
	};

	return (
		<AnalyticsContext.Provider
			value={{
				showAnalytics,
				setShowAnalytics,
				updateShowAnalytics,
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
