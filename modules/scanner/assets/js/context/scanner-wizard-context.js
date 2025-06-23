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
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import {
	sortRemediation,
	sortViolations,
} from '@ea11y-apps/scanner/utils/sort-violations';
import {
	createContext,
	useContext,
	useEffect,
	useState,
} from '@wordpress/element';

export const ScannerWizardContext = createContext({
	results: {},
	remediations: [],
	resolved: 0,
	openedBlock: '',
	loading: null,
	isError: false,
	isManage: false,
	sortedViolations: INITIAL_SORTED_VIOLATIONS,
	sortedRemediation: INITIAL_SORTED_VIOLATIONS,
	altTextData: [],
	manualData: {},
	remediationData: {},
	violation: null,
	openIndex: null,
	setSortedRemediation: () => {},
	setOpenedBlock: () => {},
	setResolved: () => {},
	getResults: () => {},
	setAltTextData: () => {},
	setManualData: () => {},
	setLoading: () => {},
	setRemediationData: () => {},
	updateRemediationList: () => {},
	setIsManage: () => {},
	isResolved: () => {},
	handleOpen: () => {},
	setOpenIndex: () => {},
	runNewScan: () => {},
});

export const ScannerWizardContextProvider = ({ children }) => {
	const [results, setResults] = useState();
	const [remediations, setRemediations] = useState([]);
	const [sortedViolations, setSortedViolations] = useState(
		INITIAL_SORTED_VIOLATIONS,
	);
	const [sortedRemediation, setSortedRemediation] = useState(
		INITIAL_SORTED_VIOLATIONS,
	);
	const [resolved, setResolved] = useState(0);
	const [openedBlock, setOpenedBlock] = useState(BLOCKS.main);
	const [loading, setLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [isManage, setIsManage] = useState(false);
	const [altTextData, setAltTextData] = useState([]);
	const [manualData, setManualData] = useState(structuredClone(MANUAL_GROUPS));
	const [remediationData, setRemediationData] = useState(
		structuredClone(MANUAL_GROUPS),
	);
	const [openIndex, setOpenIndex] = useState(null);

	useEffect(() => {
		const items = isManage
			? sortedRemediation[openedBlock]
			: sortedViolations[openedBlock];
		if (
			openIndex !== null &&
			sortedViolations[openedBlock]?.length &&
			openIndex < items?.length
		) {
			const element = isManage
				? getElementByXPath(
						JSON.parse(sortedRemediation[openedBlock][openIndex].content)
							?.xpath,
					)
				: sortedViolations[openedBlock][openIndex].node;
			focusOnElement(element);
		} else {
			removeExistingFocus();
		}
	}, [openIndex]);

	useEffect(() => {
		if (
			Object.keys(sortedRemediation).every(
				(key) => sortedRemediation[key].length === 0,
			)
		) {
			setRemediations([]);
		}
	}, [sortedRemediation]);

	const updateRemediationList = async () => {
		try {
			const items = await APIScanner.getRemediations(
				window.ea11yScannerData?.pageData?.url,
			);

			const filteredRemediations = items.data.filter(
				(remediation) => remediation.group !== BLOCKS.altText,
			);

			const sorted = sortRemediation(filteredRemediations);

			setRemediations(filteredRemediations);
			setSortedRemediation(sorted);
		} catch (error) {
			setIsError(true);
		}
	};

	const handleOpen = (index, item) => (event, isExpanded) => {
		setOpenIndex(isExpanded ? index : null);
		if (!isManage) {
			mixpanelService.sendEvent(mixpanelEvents.issueSelected, {
				issue_type: item.message,
				rule_id: item.ruleId,
				wcag_level: item.reasonCategory.match(/\(([^)]+)\)/)?.[1],
				category_name: BLOCK_TITLES[openedBlock],
			});
		}
	};

	const handleOpenBlock = (block) => {
		setOpenedBlock(block);
		setOpenIndex(null);
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
			const url = new URL(window.location.href);
			const data = await window.ace.check(document);
			const filtered = data.results.filter(
				(item) => item.level === 'violation',
			);
			const sorted = sortViolations(filtered);
			await registerPage(data, sorted);
			await addScanResults(data);

			mixpanelService.sendEvent(mixpanelEvents.scanTriggered, {
				page_url: window.ea11yScannerData?.pageData?.url,
				issue_count: data.summary?.counts?.violation,
				source: url.searchParams.get('open-ea11y-assistant-src'),
			});

			return data.summary;
		} catch (error) {
			setIsError(true);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (window.ea11yScannerData?.isConnected) {
			scannerWizard
				.load()
				.then(() => {
					void getResults();
				})
				.catch(() => {
					setIsError(true);
					setLoading(false);
				});
			void updateRemediationList();
		} else {
			setLoading(false);
		}
	}, [window.ea11yScannerData?.isConnected]);

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

	const runNewScan = () => {
		const url = new URL(window.location.href);
		url.searchParams.delete('open-ea11y-assistant');
		url.searchParams.delete('open-ea11y-assistant-src');
		url.searchParams.append('open-ea11y-assistant-src', 'rescan_button');
		url.searchParams.append('open-ea11y-assistant', '1');

		window.location.assign(url);
	};

	return (
		<ScannerWizardContext.Provider
			value={{
				results,
				resolved,
				remediations,
				openedBlock,
				loading,
				isError,
				isManage,
				sortedViolations,
				sortedRemediation,
				altTextData,
				manualData,
				remediationData,
				violation,
				setOpenedBlock: handleOpenBlock,
				setResolved,
				setSortedRemediation,
				getResults,
				setLoading,
				setAltTextData,
				setManualData,
				setRemediationData,
				updateRemediationList,
				setIsManage,
				openIndex,
				setOpenIndex,
				isResolved,
				handleOpen,
				runNewScan,
			}}
		>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
