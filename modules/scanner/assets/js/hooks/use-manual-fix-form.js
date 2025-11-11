import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementContext } from '@ea11y-apps/scanner/utils/get-element-context';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useManualFixForm = ({ item, current }) => {
	const {
		openedBlock,
		manualData,
		setOpenIndex,
		setManualData,
		resolved,
		currentScanId,
		setResolved,
		isResolved,
		setOpenedBlock,
		updateRemediationList,
	} = useScannerWizardContext();
	const { error } = useToastNotification();

	const [aiResponseLoading, setAiResponseLoading] = useState(false);
	const [resolving, setResolving] = useState(false);
	const [firstOpen, setFirstOpen] = useState(true);

	const [manualEdit, setManualEdit] = useState(false);
	const [aiSuggestion, setAiSuggestion] = useState(null);

	const isGlobal =
		manualData[openedBlock][current]?.isGlobal || item.global || false;

	const isGlobalRef = useRef(null);

	useEffect(() => {
		if (item?.node) {
			isGlobalRef.current = isGlobal;
		}
	}, [current]);

	useEffect(() => {
		setAiSuggestion({
			...manualData[openedBlock][current]?.aiSuggestion,
			submitted: false,
		});
		setManualEdit(manualData[openedBlock][current]?.aiSuggestion?.snippet);
	}, [manualData[openedBlock][current]?.aiSuggestion]);

	useEffect(() => {
		if (!firstOpen && isResolved(openedBlock)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
		setFirstOpen(false);
	}, [isResolved(openedBlock)]);

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

	const setIsGlobal = (value) => {
		updateData({
			isGlobal: value,
		});
	};

	const getAISuggestion = async () => {
		try {
			setAiResponseLoading(true);
			const context = getElementContext(item.node);
			const result = await APIScanner.resolveWithAI({
				snippet: item.snippet,
				violation: item.ruleId,
				context,
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

	const markResolved = (remediation) => {
		updateData({ remediation, resolved: true, isGlobal });
		setResolved(resolved + 1);
		setOpenIndex(current + 1);
	};

	const handleUpdate = async () => {
		setResolving(true);
		try {
			const content = JSON.parse(
				manualData[openedBlock][current]?.remediation.content,
			);
			const replace =
				manualEdit || manualData[openedBlock][current]?.aiSuggestion.snippet;
			const strContent = JSON.stringify({
				...content,
				replace,
			});
			await APIScanner.updateRemediationContent({
				url: window?.ea11yScannerData?.pageData?.url,
				id: manualData[openedBlock][current]?.remediation.id,
				content: strContent,
				global: isGlobal,
			});
			mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
				fix_method: 'manual',
				issue_type: item.message,
				snippet_content: replace,
				category_name: openedBlock,
				source: 'assistant',
				page_url: window.ea11yScannerData?.pageData?.url,
				is_global: isGlobal ? 'yes' : 'no',
			});
			void updateRemediationList();
			isGlobalRef.current = isGlobal;
			setOpenIndex(current + 1);
		} catch (e) {
			console.log(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setResolving(false);
		}
	};

	const handleSubmit = async () => {
		setResolving(true);

		try {
			const replace =
				manualEdit || manualData[openedBlock][current]?.aiSuggestion.snippet;

			const response = await APIScanner.submitRemediation({
				url: window?.ea11yScannerData?.pageData.url,
				remediation: {
					find: item.snippet,
					replace,
					xpath: item.path.dom,
					category: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
					type: 'REPLACE',
				},
				global: isGlobal,
				rule: item.ruleId,
				group: BLOCKS[openedBlock],
				apiId: manualData[openedBlock]?.[current]?.apiId,
			});
			await APIScanner.resolveIssue(currentScanId);
			isGlobalRef.current = isGlobal;
			markResolved(response.remediation);

			mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
				fix_method: manualEdit ? 'manual' : 'AI',
				issue_type: item.message,
				snippet_content: replace,
				category_name: openedBlock,
				source: 'assistant',
				page_url: window.ea11yScannerData?.pageData?.url,
				is_global: isGlobal ? 'yes' : 'no',
			});

			void updateRemediationList();
		} catch (e) {
			console.log(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setResolving(false);
		}
	};

	const isSubmitDisabled =
		manualData[openedBlock][current]?.resolved &&
		manualData[openedBlock][current].isGlobal === isGlobalRef.current;

	return {
		aiResponseLoading,
		resolving,
		isGlobal,
		isSubmitDisabled,
		setIsGlobal,
		manualEdit,
		setManualEdit,
		aiSuggestion,
		setAiSuggestion,
		markResolved,
		getAISuggestion,
		resolveIssue: manualData[openedBlock][current]?.resolved
			? handleUpdate
			: handleSubmit,
	};
};

useManualFixForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
};
