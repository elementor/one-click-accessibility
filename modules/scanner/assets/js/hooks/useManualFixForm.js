import clipboardCopy from 'clipboard-copy';
import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useManualFixForm = ({ item, current }) => {
	const {
		openedBlock,
		manualData,
		setOpenIndex,
		setManualData,
		resolved,
		setResolved,
	} = useScannerWizardContext();
	const { error } = useToastNotification();

	const [copied, setCopied] = useState(false);
	const [aiResponseLoading, setAiResponseLoading] = useState(false);
	const [resolving, setResolving] = useState(false);

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

	const copyToClipboard = (snippet) => async () => {
		await clipboardCopy(snippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 5000);
	};

	const resolveIssue = async () => {
		setResolving(true);
		try {
			await APIScanner.submitRemediation({
				url: window?.ea11yScannerData?.pageData.url,
				remediation: {
					find: item.snippet,
					replace: manualData[openedBlock][current]?.aiSuggestion.snippet,
					xpath: item.path.dom,
					type: 'REPLACE',
				},
				apiId: manualData[openedBlock]?.[current]?.apiId,
			});
			markResolved();
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
