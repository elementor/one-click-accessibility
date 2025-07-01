import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { speak } from '@wordpress/a11y';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
} from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import APISettings from '../api';

const AccessibilityAssistantContext = createContext(null);

export const AccessibilityAssistantContextProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);
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
	 * Get initial data
	 */
	useEffect(() => {
		setLoading(true);

		Promise.all([
			APISettings.getScannerStats(period),
			APISettings.getPostTypes(),
			APISettings.getScannerResults(),
		])
			.then(([statsData, postTypesData, scannerResultsData]) => {
				setStats(statsData);
				setPostTypes(postTypesData);
				setScannerResults(scannerResultsData);
			})
			.finally(() => {
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		setLoading(true);

		void APISettings.getScannerStats(period).then((data) => {
			setStats(data);
			setLoading(false);
		});
	}, [period]);

	useEffect(() => {
		const results = getFilteredScannerResults();

		if (results.length) {
			speak(
				sprintf(
					// Translators: %s - count
					__('Found %s scanned URLs', 'pojo-accessibility'),
					results.length,
				),
				'polite',
			);
		} else {
			speak(
				__(
					'No scanned URLs found for the provided search query',
					'pojo-accessibility',
				),
				'polite',
			);
		}
	}, [search]);

	const getFilteredScannerResults = useCallback(() => {
		const now = new Date();
		const cutoffDate = new Date(now);

		cutoffDate.setDate(now.getDate() - period);
		cutoffDate.setHours(0);
		cutoffDate.setMinutes(0);
		cutoffDate.setSeconds(0);

		const filteredByDate = scannerResults.filter((result) => {
			const scanDate = new Date(result.last_scan);

			return scanDate >= cutoffDate;
		});

		const lowerSearch = search.trim().toLowerCase();

		const filtered = filteredByDate.filter((result) => {
			return (
				result.page_title?.toLowerCase().includes(lowerSearch) ||
				result.page_url?.toLowerCase().includes(lowerSearch)
			);
		});

		const start = page * rowsPerPage;

		const safeStart = start >= filtered.length ? 0 : start;
		const safeEnd = safeStart + rowsPerPage;

		return filtered.slice(safeStart, safeEnd);
	}, [search, scannerResults, page, rowsPerPage, period]);

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
