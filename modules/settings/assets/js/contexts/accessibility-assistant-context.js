import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from '@wordpress/element';
import APISettings from '../api';

const AccessibilityAssistantContext = createContext(null);

export const AccessibilityAssistantContextProvider = ({ children }) => {
	const [loading, setLoading] = useState(false);
	const [period, setPeriod] = useState(30);
	const [search, setSearch] = useState('');
	const [scannerResults, setScannerResults] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [stats, setStats] = useState({
		scans: 0,
		issues_total: 0,
		issues_fixed: 0,
		issue_levels: {
			a: 0,
			aa: 0,
			aaa: 0,
		},
	});
	const [postTypes, setPostTypes] = useState({});

	const onPeriodChange = (event) => {
		setPeriod(parseInt(event.target.value, 10));

		mixpanelService.sendEvent(mixpanelEvents.filterSelected, {
			selectedItem: event.target.value,
		});
	};

	/**
	 * Get initial logs list
	 */
	useEffect(() => {
		setLoading(true);

		void APISettings.getScannerStats(period).then((data) => {
			setStats(data);
			setLoading(false);
		});

		void APISettings.getPostTypes().then((data) => {
			setPostTypes(data);
			setLoading(false);
		});

		void APISettings.getScannerResults(period).then((data) => {
			setScannerResults(data);
			setLoading(false);
		});
	}, [period]);

	const getFilteredScannerResults = useCallback(() => {
		const lowerSearch = search.toLowerCase();

		const filtered = scannerResults.filter((result) => {
			return (
				result.page_title?.toLowerCase().includes(lowerSearch) ||
				result.page_url?.toLowerCase().includes(lowerSearch)
			);
		});

		const start = page * rowsPerPage;

		const safeStart = start >= filtered.length ? 0 : start;
		const safeEnd = safeStart + rowsPerPage;

		return filtered.slice(safeStart, safeEnd);
	}, [search, scannerResults, page, rowsPerPage]);

	return (
		<AccessibilityAssistantContext.Provider
			value={{
				period,
				onPeriodChange,
				stats,
				postTypes,
				scannerResults,
				getFilteredScannerResults,
				search,
				setSearch,
				page,
				setPage,
				rowsPerPage,
				setRowsPerPage,
				loading,
			}}
		>
			{children}
		</AccessibilityAssistantContext.Provider>
	);
};

export const useAccessibilityAssistantContext = () => {
	return useContext(AccessibilityAssistantContext);
};
