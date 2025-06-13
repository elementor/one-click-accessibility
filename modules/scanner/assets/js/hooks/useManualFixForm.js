import clipboardCopy from 'clipboard-copy';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { BLOCK_TITLES, BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useManualFixForm = ({ item, current }) => {
	const {
		openedBlock,
		manualData,
		setOpenIndex,
		setManualData,
		resolved,
		setResolved,
		isResolved,
		setOpenedBlock,
	} = useScannerWizardContext();
	const { error } = useToastNotification();

	const [copied, setCopied] = useState(false);
	const [aiResponseLoading, setAiResponseLoading] = useState(false);
	const [resolving, setResolving] = useState(false);
	const [firstOpen, setFirstOpen] = useState(true);

	useEffect(() => {
		if (!firstOpen && isResolved(openedBlock)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
		setFirstOpen(false);
	}, [manualData]);

	const updateData = (data) => {
		const updData = [...manualData[openedBlock]];
		updData[current] = {
			...(manualData[openedBlock]?.[current] || {}),
			...data,
		};
		setManualData({
			...manualData,
			[openedBlock]: updData,
		});
	};

	const getAISuggestion = async () => {
		try {
			setAiResponseLoading(true);
			const result = await APIScanner.resolveWithAI({
				snippet: item.snippet,
				violation: item.ruleId,
			});
			updateData({
				aiSuggestion: result.data.response,
				apiId: result.data.apiId,
				resolved: false,
			});
		} catch (e) {
			console.log(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setAiResponseLoading(false);
		}
	};

	const markResolved = () => {
		updateData({ resolved: true });
		setResolved(resolved + 1);
		setOpenIndex(current + 1);
	};

	const copyToClipboard = (snippet, type) => async () => {
		await clipboardCopy(snippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 5000);
		mixpanelService.sendEvent(mixpanelEvents.copySnippetClicked, {
			snippet_type: type,
			snippet_content: snippet,
		});
	};

	const resolveIssue = async (manualEdit) => {
		setResolving(true);
		try {
			await APIScanner.submitRemediation({
				url: window?.ea11yScannerData?.pageData.url,
				remediation: {
					find: item.snippet,
					replace:
						manualEdit ||
						manualData[openedBlock][current]?.aiSuggestion.snippet,
					xpath: item.path.dom,
					category: item.reasonCategory.match(/\(([^)]+)\)/)[1],
					type: 'REPLACE',
				},
				apiId: manualData[openedBlock]?.[current]?.apiId,
			});
			markResolved();
			mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
				fix_method: 'AI',
				issue_type: item.message,
				category_name: BLOCK_TITLES[openedBlock],
			});
		} catch (e) {
			console.log(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setResolving(false);
		}
	};

	return {
		copied,
		aiResponseLoading,
		resolving,
		markResolved,
		copyToClipboard,
		getAISuggestion,
		resolveIssue,
	};
};

useManualFixForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
};
