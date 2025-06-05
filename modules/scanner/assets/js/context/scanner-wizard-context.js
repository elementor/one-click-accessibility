import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BLOCK_TITLES,
	BLOCKS,
	INITIAL_SORTED_VIOLATIONS,
	MANUAL_GROUPS,
} from '@ea11y-apps/scanner/constants';
import { scannerWizard } from '@ea11y-apps/scanner/services/scanner-wizard';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
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
	openIndex: null,
	setOpenedBlock: () => {},
	setResolved: () => {},
	getResults: () => {},
	setAltTextData: () => {},
	setManualData: () => {},
	isResolved: () => {},
	handleOpen: () => {},
	setOpenIndex: () => {},
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
	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		if (
			openIndex !== null &&
			sortedViolations[openedBlock]?.length &&
			openIndex < sortedViolations[openedBlock]?.length
		) {
			focusOnElement(sortedViolations[openedBlock][openIndex].node);
		} else {
			removeExistingFocus();
		}
	}, [openIndex]);

	const handleOpen = (index, item) => (event, isExpanded) => {
		setOpenIndex(isExpanded ? index : null);
		mixpanelService.sendEvent(mixpanelEvents.issueSelected, {
			issue_type: item.message,
			rule_id: item.ruleId,
			wcag_level: item.reasonCategory.match(/\(([^)]+)\)/)?.[1],
			category_name: BLOCK_TITLES[openedBlock],
		});
	};

	const initialViolations =
		window.ea11yScannerData.initialScanResult?.counts?.violation ?? 0;
	const violation = results?.summary?.counts?.violation
		? Math.max(initialViolations, results?.summary?.counts?.violation)
		: null;

	const registerPage = async (data, sorted) => {
		try {
			if (window?.ea11yScannerData?.pageData?.unregistered) {
				await APIScanner.registerPage(
					window?.ea11yScannerData?.pageData,
					data.summary,
				);
			}
			setResults(data);
			setSortedViolations(sorted);
			setAltTextData([]);
			setManualData(structuredClone(MANUAL_GROUPS));
			setResolved(
				initialViolations > data.summary?.counts?.violation
					? initialViolations - data.summary?.counts?.violation
					: 0,
			);
		} catch (e) {
			setIsError(true);
		}
	};

	const addScanResults = async (data) => {
		try {
			await APIScanner.addScanResults(
				window?.ea11yScannerData?.pageData?.url,
				data.summary,
			);
		} catch (e) {
			console.error(e);
			setIsError(true);
		}
	};

	const getResults = async () => {
		setLoading(true);
		try {
			const data = await window.ace.check(document);
			const filtered = data.results.filter(
				(item) => item.level === 'violation',
			);
			const sorted = sortViolations(filtered);
			await registerPage(data, sorted);
			await addScanResults(data);

			return data.summary;
		} catch (error) {
			setIsError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		scannerWizard
			.load()
			.then(() => {
				getResults();
			})
			.catch(() => {
				setIsError(true);
				setLoading(false);
			});
	}, []);

	const isResolved = (block) => {
		const indexes = Array.from(
			{
				length: sortedViolations[block]?.length || 0,
			},
			(_, i) => i,
		);
		return block === BLOCKS.altText
			? (altTextData?.length === sortedViolations[block]?.length &&
					indexes.every((index) => index in altTextData) &&
					altTextData.every((data) => data?.resolved)) ||
					sortedViolations[block]?.length === 0
			: (manualData[block]?.length === sortedViolations[block]?.length &&
					indexes.every((index) => index in manualData[block]) &&
					manualData[block].every((data) => data?.resolved)) ||
					sortedViolations[block]?.length === 0;
	};

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
				openIndex,
				setOpenIndex,
				isResolved,
				handleOpen,
			}}
		>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
