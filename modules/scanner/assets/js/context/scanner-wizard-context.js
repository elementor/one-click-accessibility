import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BLOCKS,
	INITIAL_SORTED_VIOLATIONS,
	MANAGE_URL_PARAM,
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
	currentScanId: null,
	resolved: 0,
	openedBlock: '',
	loading: null,
	isError: false,
	quotaExceeded: false,
	isManage: false,
	isChanged: false,
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
	setIsManageChanged: () => {},
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
	const [currentScanId, setCurrentScanId] = useState(null);
	const [openedBlock, setOpenedBlock] = useState(BLOCKS.main);
	const [loading, setLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [quotaExceeded, setQuotaExceeded] = useState(false);
	const [isManage, setIsManage] = useState(false);
	const [isManageChanged, setIsManageChanged] = useState(false);
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

			const sorted = sortRemediation(items.data);

			setRemediations(items.data);
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
				wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
				category_name: openedBlock,
			});
		}
	};

	const handleOpenBlock = (block) => {
		setOpenedBlock(block);
		setOpenIndex(null);
	};

	const initialViolations =
		window.ea11yScannerData.initialScanResult?.counts?.violation ?? 0;
	const violation =
		results?.summary?.counts?.violation >= 0
			? results?.summary?.counts?.violation
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
				initialViolations >= data.summary?.counts?.issuesResolved
					? data.summary?.counts?.issuesResolved
					: 0,
			);
		} catch (e) {
			if (e?.message === 'Quota exceeded') {
				setQuotaExceeded(true);
			}
			setIsError(true);
		}
	};

	const addScanResults = async (data) => {
		try {
			const response = await APIScanner.addScanResults({
				url: window?.ea11yScannerData?.pageData?.url,
				summary: data.summary,
			});
			void APIScanner.triggerSave({
				object_id: window?.ea11yScannerData?.pageData?.object_id,
				object_type: window?.ea11yScannerData?.pageData?.object_type,
			});

			setCurrentScanId(response.scanId);
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
				(item) =>
					item.level === 'violation' ||
					(item.ruleId === 'text_contrast_sufficient' &&
						item.level === 'potentialViolation'),
			);
			const sorted = sortViolations(filtered);

			if (data?.summary?.counts) {
				data.summary.counts.issuesResolved = 0;
			}

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
			//Wait for apply FE remediation
			setTimeout(() => {
				scannerWizard
					.load()
					.then(() => {
						void getResults();
					})
					.catch(() => {
						setIsError(true);
						setLoading(false);
					});
			}, 500);
			void updateRemediationList();
		} else {
			setLoading(false);
		}
	}, [window.ea11yScannerData?.isConnected]);

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get(MANAGE_URL_PARAM) === '1') {
			setIsManage(true);
			handleOpenBlock(BLOCKS.management);
		}
	}, [window.location.search]);

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

	const isChanged =
		altTextData.length > 0 ||
		Object.keys(manualData).some(
			(key) => manualData[key] && manualData[key].length > 0,
		) ||
		isManageChanged;

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
				currentScanId,
				openedBlock,
				loading,
				isError,
				quotaExceeded,
				isManage,
				isChanged,
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
				setIsManageChanged,
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
