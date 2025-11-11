import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import {
	BLOCKS,
	LEVEL_POTENTIAL,
	LEVEL_VIOLATION,
	MANUAL_GROUPS,
	RATIO_EXCLUDED,
	RULE_TEXT_CONTRAST,
} from '@ea11y-apps/scanner/constants';
import { runAllEa11yRules } from '@ea11y-apps/scanner/rules';
import { getPageHeadingsTree } from '@ea11y-apps/scanner/utils/page-headings';
import {
	sortRemediation,
	sortViolations,
} from '@ea11y-apps/scanner/utils/sort-violations';
import {
	calculateStats,
	validateHeadings,
} from '@ea11y-apps/scanner/utils/validate-headings';

export default function useScannerWizardActions(state) {
	const {
		openedBlock,
		isManage,
		setResults,
		setSortedViolations,
		setAltTextData,
		setManualData,
		setCurrentScanId,
		setIsError,
		setQuotaExceeded,
		setLoading,
		setRemediations,
		setSortedRemediation,
		setGlobalRemediations,
		setSortedGlobalRemediation,
		setOpenIndex,
	} = state;

	const updateRemediationList = async () => {
		try {
			const items = await APIScanner.getRemediations(
				window.ea11yScannerData?.pageData?.url,
			);
			const sorted = sortRemediation(items.data.page);
			const sortedGlobal = sortRemediation(items.data.global);
			setRemediations(items.data.page);
			setSortedRemediation(sorted);
			setGlobalRemediations(items.data.global);
			setSortedGlobalRemediation(sortedGlobal);
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
		state.setOpenedBlock(block);
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
				runNewScan();
			}

			setResults(data);
			setSortedViolations(sorted);
			setAltTextData({ manage: [], main: [] });
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
					!state.dismissedHeadingIssues?.includes(item.path.dom),
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

	const runNewScan = () => {
		const url = new URL(window.location.href);

		const keys = [...url.searchParams.keys()];
		for (const key of keys) {
			url.searchParams.delete(key);
		}
		url.searchParams.append('open-ea11y-assistant-src', 'rescan_button');
		url.searchParams.append('open-ea11y-assistant', '1');

		window.location.assign(url);
	};

	const getHeadingsStats = () => {
		const updatedHeadings = validateHeadings(
			getPageHeadingsTree(),
			state.dismissedHeadingIssues,
		);
		return calculateStats(updatedHeadings);
	};

	const isResolved = (block) => {
		const type = state.isManage ? 'manage' : 'main';
		const { sortedViolations, altTextData, colorContrastData, manualData } =
			state;

		const indexes = Array.from(
			{ length: sortedViolations[block]?.length || 0 },
			(_, i) => i,
		);

		switch (block) {
			case BLOCKS.altText:
				return (
					(altTextData?.[type]?.length === sortedViolations[block]?.length &&
						indexes.every((index) => index in altTextData.main) &&
						altTextData[type].every((data) => data?.resolved)) ||
					sortedViolations[block]?.length === 0
				);

			case BLOCKS.colorContrast:
				return (
					(colorContrastData?.[type]?.length ===
						sortedViolations[block]?.length &&
						indexes.every((index) => index in colorContrastData.main) &&
						colorContrastData[type].every((data) => data?.resolved)) ||
					sortedViolations[block]?.length === 0
				);

			case BLOCKS.headingStructure: {
				const updatedHeadings = validateHeadings(
					getPageHeadingsTree(),
					state.dismissedHeadingIssues,
				);
				const stats = calculateStats(updatedHeadings);
				return stats.error === 0;
			}

			default:
				return (
					(manualData[block]?.length === sortedViolations[block]?.length &&
						indexes.every((index) => index in manualData[block]) &&
						manualData[block].every((data) => data?.resolved)) ||
					sortedViolations[block]?.length === 0
				);
		}
	};

	return {
		updateRemediationList,
		handleOpen,
		handleOpenBlock,
		registerPage,
		addScanResults,
		getResults,
		runNewScan,
		getHeadingsStats,
		isResolved,
	};
}
