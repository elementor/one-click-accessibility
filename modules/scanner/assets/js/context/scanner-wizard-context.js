import {
	BLOCKS,
	INITIAL_SORTED_VIOLATIONS,
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
	sortedViolations: INITIAL_SORTED_VIOLATIONS,
	setOpenedBlock: () => {},
	setResolved: () => {},
	getResults: () => {},
});

export const ScannerWizardContextProvider = ({ children }) => {
	const [results, setResults] = useState();
	const [sortedViolations, setSortedViolations] = useState(
		INITIAL_SORTED_VIOLATIONS,
	);
	const [resolved, setResolved] = useState(0);
	const [openedBlock, setOpenedBlock] = useState(BLOCKS.main);

	const getResults = () => {
		window.ace.check(document).then((data) => {
			const filtered = data.results.filter(
				(item) => item.level === 'violation',
			);
			const sorted = sortViolations(filtered);
			setResults(data);
			setSortedViolations(sorted);
		});
	};

	useEffect(() => {
		getResults();
	}, []);

	return (
		<ScannerWizardContext.Provider
			value={{
				results,
				resolved,
				openedBlock,
				sortedViolations,
				setOpenedBlock,
				setResolved,
				getResults,
			}}
		>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
