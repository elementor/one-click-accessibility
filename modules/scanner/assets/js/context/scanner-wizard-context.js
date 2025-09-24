import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BLOCKS,
	INITIAL_SORTED_VIOLATIONS,
	LEVEL_POTENTIAL,
	LEVEL_VIOLATION,
	MANAGE_URL_PARAM,
	MANUAL_GROUPS,
	RATIO_EXCLUDED,
	RULE_TEXT_CONTRAST,
} from '@ea11y-apps/scanner/constants';
import useScannerSettings from '@ea11y-apps/scanner/hooks/use-scanner-settings';
import { runAllEa11yRules } from '@ea11y-apps/scanner/rules';
import { scannerWizard } from '@ea11y-apps/scanner/services/scanner-wizard';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { getPageHeadingsTree } from '@ea11y-apps/scanner/utils/page-headings';
import {
	sortRemediation,
	sortViolations,
} from '@ea11y-apps/scanner/utils/sort-violations';
import {
	calculateStats,
	validateHeadings,
} from '@ea11y-apps/scanner/utils/validate-headings';
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
	const { dismissedHeadingIssues } = useScannerSettings();

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
	const [violation, setViolation] = useState(null);

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

	useEffect(() => {
		if (results?.summary?.counts) {
			const total = Object.values(sortedViolations).reduce(
				(sum, arr) => sum + arr.length,
				0,
			);
			setViolation(total);
		}
	}, [sortedViolations, results]);

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

	const registerPage = async (data, sorted) => {
		try {
			if (window?.ea11yScannerData?.pageData?.unregistered) {
				await APIScanner.registerPage(
					window?.ea11yScannerData?.pageData,
					data.summary,
				);
				window.ea11yScannerData.pageData.unregistered = false;
			}

			setResults(data);
			setSortedViolations(sorted);
			setAltTextData([]);
			setManualData(structuredClone(MANUAL_GROUPS));
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

	const isViolation = (item) => item.level === LEVEL_VIOLATION;
	const isContrastViolation = (item) =>
		item.ruleId === RULE_TEXT_CONTRAST &&
		item.level === LEVEL_POTENTIAL &&
		Number(item.messageArgs[0]) !== RATIO_EXCLUDED;

	const getResults = async () => {
		setLoading(true);

		try {
			const url = new URL(window.location.href);
			const data = await window.ace.check(document);

			const filtered = data.results.filter(
				(item) => isViolation(item) || isContrastViolation(item),
			);

			const customResults = runAllEa11yRules(document);

			const filteredCustomResults = customResults.filter(
				(item) =>
					item.level === 'violation' &&
					!dismissedHeadingIssues.includes(item.path.dom),
			);

			const allResults = [...filtered, ...filteredCustomResults];

			data.results = allResults;

			if (data?.summary?.counts) {
				data.summary.counts.issuesResolved = 0;
				data.summary.counts.violation += filteredCustomResults.filter(
					(item) => item.level === 'violation',
				).length;
				data.summary.counts.recommendation =
					(data.summary.counts.recommendation || 0) +
					filteredCustomResults.filter(
						(item) => item.level === 'recommendation',
					).length;
			}

			const sorted = sortViolations(allResults);

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
		switch (block) {
			case BLOCKS.altText:
				return (
					(altTextData?.length === sortedViolations[block]?.length &&
						indexes.every((index) => index in altTextData) &&
						altTextData.every((data) => data?.resolved)) ||
					sortedViolations[block]?.length === 0
				);
			case BLOCKS.headingStructure:
				const stats = getHeadingsStats();
				return stats.error === 0;
			default:
				return (
					(manualData[block]?.length === sortedViolations[block]?.length &&
						indexes.every((index) => index in manualData[block]) &&
						manualData[block].every((data) => data?.resolved)) ||
					sortedViolations[block]?.length === 0
				);
		}
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

	const getHeadingsStats = () => {
		const updatedHeadings = validateHeadings(
			getPageHeadingsTree(),
			dismissedHeadingIssues,
		);
		return calculateStats(updatedHeadings);
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
				getHeadingsStats,
			}}
		>
			{children}
		</ScannerWizardContext.Provider>
	);
};

export const useScannerWizardContext = () => {
	return useContext(ScannerWizardContext);
};
