import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BLOCKS,
	INITIAL_SORTED_VIOLATIONS,
	MANUAL_GROUPS,
} from '@ea11y-apps/scanner/constants';
import { scannerWizard } from '@ea11y-apps/scanner/services/scanner-wizard';
import { sortViolations } from '@ea11y-apps/scanner/utils/sort-violations';
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';

export const ScannerWizardContext = createContext({
	results: {},
	resolved: 0,
	openedBlock: '',
	loading: null,
	isError: false,
	sortedViolations: INITIAL_SORTED_VIOLATIONS,
	altTextData: [],
	manualData: {},
	violation: null,
	setOpenedBlock: () => {},
	setResolved: () => {},
	getResults: () => {},
	setAltTextData: () => {},
	setManualData: () => {},
	isResolved: () => {},
});

export const ScannerWizardContextProvider = ({ children }) => {
	const [results, setResults] = useState();
	const [sortedViolations, setSortedViolations] = useState(
		INITIAL_SORTED_VIOLATIONS,
	);
	const [resolved, setResolved] = useState(0);
	const [openedBlock, setOpenedBlock] = useState(BLOCKS.main);
	const [loading, setLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [altTextData, setAltTextData] = useState([]);
	const [manualData, setManualData] = useState(structuredClone(MANUAL_GROUPS));

	const violation = results?.summary?.counts?.violation;

	const getResults = () => {
		setLoading(true);
		window.ace
			.check(document)
			.then((data) => {
				const filtered = data.results.filter(
					(item) => item.level === 'violation',
				);
				const sorted = sortViolations(filtered);
				setResults(data);
				setSortedViolations(sorted);
				setAltTextData([]);
				setManualData(structuredClone(MANUAL_GROUPS));
				setResolved(0);
				if (window?.ea11yScannerData?.pageData?.unregistered) {
					void APIScanner.registerPage();
				}
			})
			.catch(() => {
				setIsError(true);
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		scannerWizard
			.load()
			.then(() => {
				getResults();
			})
			.catch(() => setIsError(true));
	}, []);

	const isResolved = (block) =>
		block === BLOCKS.altText
			? (altTextData?.length === sortedViolations[block]?.length &&
					altTextData.every((data) => data?.resolved)) ||
				sortedViolations[block]?.length === 0
			: (manualData[block]?.length === sortedViolations[block]?.length &&
					manualData[block].every((data) => data.resolved)) ||
				sortedViolations[block]?.length === 0;

	return (
		<ScannerWizardContext.Provider
			value={{
				results,
				resolved,
				openedBlock,
				loading,
				isError,
				sortedViolations,
				altTextData,
				manualData,
				violation,
				setOpenedBlock,
				setResolved,
				getResults,
				setAltTextData,
				setManualData,
				isResolved,
			}}
		>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
