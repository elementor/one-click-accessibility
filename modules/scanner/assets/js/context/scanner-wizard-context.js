import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { scannerWizard } from '@ea11y-apps/scanner/services/scanner-wizard';
import {
	BLOCKS,
	INITIAL_SORTED_VIOLATIONS,
	MANUAL_GROUPS,
} from '@ea11y-apps/scanner/utils/constants';
import { sortViolations } from '@ea11y-apps/scanner/utils/sort-violations';
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';

const ScannerWizardContext = createContext({
	results: {},
	resolved: 0,
	openedBlock: '',
	loading: null,
	sortedViolations: INITIAL_SORTED_VIOLATIONS,
	altTextData: [],
	manualData: {},
	setOpenedBlock: () => {},
	setResolved: () => {},
	getResults: () => {},
	setAltTextData: () => {},
	setManualData: () => {},
});

export const ScannerWizardContextProvider = ({ children }) => {
	const [results, setResults] = useState();
	const [sortedViolations, setSortedViolations] = useState(
		INITIAL_SORTED_VIOLATIONS,
	);
	const [resolved, setResolved] = useState(0);
	const [openedBlock, setOpenedBlock] = useState(BLOCKS.main);
	const [loading, setLoading] = useState(true);
	const [altTextData, setAltTextData] = useState([]);
	const [manualData, setManualData] = useState(structuredClone(MANUAL_GROUPS));

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
				setResolved(0);
				if (window?.ea11yScannerData?.pageData?.unregistered) {
					void APIScanner.registerPage();
				}
			})
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		scannerWizard
			.load()
			.then(() => {
				getResults();
			})
			.catch((e) => console.error(e));
	}, []);

	return (
		<ScannerWizardContext.Provider
			value={{
				results,
				resolved,
				openedBlock,
				loading,
				sortedViolations,
				altTextData,
				manualData,
				setOpenedBlock,
				setResolved,
				getResults,
				setAltTextData,
				setManualData,
			}}
		>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
