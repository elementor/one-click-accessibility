import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useBulkGeneration } from '@ea11y-apps/scanner/context/bulk-generation-context';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { getOuterHtmlByXpath } from '@ea11y-apps/scanner/utils/get-outer-html-by-xpath';
import { splitDescriptions } from '@ea11y-apps/scanner/utils/split-ai-response';
import {
	convertSvgToPngBase64,
	svgNodeToPngBase64,
} from '@ea11y-apps/scanner/utils/svg-to-png-base64';
import { speak } from '@wordpress/a11y';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const getPayload = async (item) => {
	if (item.node?.src) {
		return item.node.src.toLowerCase().endsWith('.svg')
			? { svg: await convertSvgToPngBase64(item.node.src) }
			: { image: item.node.src };
	}
	return { svg: await svgNodeToPngBase64(item.node) };
};

export const generateAiAltText = async (item, signal = null) => {
	const data = await getPayload(item);
	const result = await APIScanner.generateAltText(data, signal);
	const descriptions = splitDescriptions(result.data.response);

	if (!descriptions[0]) {
		throw new Error('No description generated');
	}

	return {
		altText: descriptions[0],
		aiText: descriptions,
		apiId: result.data.apiId,
		aiTextIndex: 0,
	};
};

export const useAltTextForm = ({ current, item }) => {
	const {
		altTextData,
		setAltTextData,
		resolved,
		currentScanId,
		setResolved,
		isResolved,
		setOpenedBlock,
		updateRemediationList,
		isManage,
		setIsManageChanged,
	} = useScannerWizardContext();
	const { error } = useToastNotification();
	const bulkGeneration = useBulkGeneration();

	const currentGeneratingIndex = bulkGeneration?.currentGeneratingIndex;
	const shouldAbort = bulkGeneration?.shouldAbort || { current: false };
	const onCardComplete = bulkGeneration?.onCardComplete || (() => {});
	const setQuotaExceeded = bulkGeneration?.setQuotaExceeded || (() => {});

	const [loadingAiText, setLoadingAiText] = useState(false);
	const [loading, setLoading] = useState(false);
	const [firstOpen, setFirstOpen] = useState(true);

	const type = isManage ? 'manage' : 'main';
	const isGlobal =
		altTextData?.[type]?.[current]?.isGlobal || item.global || false;

	const isGlobalRef = useRef(null);
	const savedAltTextRef = useRef('');
	const abortControllerRef = useRef(null);
	const hasInitializedRef = useRef(false);

	useEffect(() => {
		if (item?.node) {
			isGlobalRef.current = isGlobal;
			if (altTextData?.[type]?.[current]?.hasValidAltText) {
				savedAltTextRef.current = altTextData?.[type]?.[current]?.altText || '';
			}
		}
	}, [current]);

	useEffect(() => {
		if (hasInitializedRef.current === current) {
			return;
		}

		const hasExistingData =
			altTextData?.[type]?.[current]?.hasValidAltText ||
			altTextData?.[type]?.[current]?.altText ||
			altTextData?.[type]?.[current]?.isGenerating ||
			altTextData?.[type]?.[current]?.makeDecorative !== undefined;

		if (hasExistingData) {
			hasInitializedRef.current = current;
			return;
		}

		if (isManage) {
			updateData({
				makeDecorative: item.data.attribute_name === 'role',
				altText:
					item.data.attribute_name !== 'role' ? item.data.attribute_value : '',
				isGlobal,
			});
		} else {
			updateData({ isGlobal });
		}

		hasInitializedRef.current = current;
	}, [isManage, current]);

	useEffect(() => {
		if (!isManage && !firstOpen && isResolved(BLOCKS.altText)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
		setFirstOpen(false);
	}, [isResolved(BLOCKS.altText)]);

	useEffect(() => {
		const isMyTurn = currentGeneratingIndex === current;

		if (!isMyTurn) {
			return;
		}

		const itemData = altTextData?.[type]?.[current];
		const hasValidAlt = itemData?.hasValidAltText;
		const isDecorative = itemData?.makeDecorative;

		const shouldGenerate = !hasValidAlt && !isDecorative;

		if (shouldGenerate) {
			const generateForCard = async () => {
				if (shouldAbort.current) {
					return;
				}

				updateData({ isGenerating: true });
				abortControllerRef.current = new AbortController();

				try {
					const aiData = await generateAiAltText(
						item,
						abortControllerRef.current.signal,
					);

					if (shouldAbort.current) {
						updateData({ isGenerating: false });
						return;
					}

					updateData({
						...aiData,
						selected: true,
						resolved: false,
						hasValidAltText: true,
						isDraft: false,
						isGenerating: false,
					});

					speak(
						__('Alt text generated successfully', 'pojo-accessibility'),
						'polite',
					);
					sendMixpanelEvent(aiData.altText);
					onCardComplete(true);
				} catch (e) {
					updateData({ isGenerating: false });

					if (!shouldAbort.current) {
						if (e?.code === 'quota_exceeded') {
							const errorMessage =
								e?.message ||
								__(
									'AI credits quota has been exceeded. Please upgrade your plan or wait for the next billing cycle.',
									'pojo-accessibility',
								);
							speak(errorMessage, 'assertive');
							setQuotaExceeded(errorMessage);
							return; // Don't call onCardComplete
						}

						if (e?.code === 'quota_api_error') {
							const errorMessage =
								e?.message ||
								__(
									'There was an error in generating Alt text using AI. Please try again after sometime.',
									'pojo-accessibility',
								);
							speak(errorMessage, 'assertive');
							return; // Don't call onCardComplete
						}

						console.error(`Failed to generate AI text for card ${current}:`, e);
						onCardComplete(false);
					}
				}
			};

			generateForCard();
		}

		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, [currentGeneratingIndex]);

	const setIsGlobal = (value) => {
		updateData({
			isGlobal: value,
		});
	};

	const updateData = (data) => {
		setAltTextData((prevAltTextData) => {
			const updData = [...(prevAltTextData?.[type] || [])];
			if (prevAltTextData?.[type]?.[current]?.resolved && !data.resolved) {
				setResolved((prev) => prev - 1);
			}
			updData[current] = {
				...(prevAltTextData?.[type]?.[current] || {}),
				...data,
			};
			return {
				...prevAltTextData,
				[type]: updData,
			};
		});
	};

	const makeAttributeData = () => {
		if (altTextData?.[type]?.[current]?.makeDecorative) {
			return {
				attribute_name: 'role',
				attribute_value: 'presentation',
			};
		}

		if (item.node.tagName === 'svg') {
			return {
				attribute_name: 'aria-label',
				attribute_value: altTextData?.[type]?.[current]?.altText,
			};
		}

		return {
			attribute_name: 'alt',
			attribute_value: altTextData?.[type]?.[current]?.altText,
		};
	};

	const updateAltText = async () => {
		const match = item.node.className.toString().match(/wp-image-(\d+)/);
		const altText = !altTextData?.[type]?.[current]?.makeDecorative
			? altTextData?.[type]?.[current]?.altText
			: '';
		const find = item.snippet;

		try {
			if (match && item.node.tagName !== 'svg') {
				void APIScanner.submitAltText(item.node.src, altText);
			}
			const response = await APIScanner.submitRemediation({
				url: window?.ea11yScannerData?.pageData.url,
				remediation: {
					...makeAttributeData(),
					action: 'add',
					xpath: item.path.dom,
					find,
					category: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
					type: 'ATTRIBUTE',
				},
				global: isGlobal,
				rule: item.ruleId,
				group: BLOCKS.altText,
				apiId: altTextData?.[type]?.[current]?.apiId,
			});

			await APIScanner.resolveIssue(currentScanId);
			void updateRemediationList();
			return response.remediation;
		} catch (e) {
			console.warn(e);
		}
	};

	const handleCheck = (e) => {
		const isChecking = e.target.checked;
		const currentAltText = altTextData?.[type]?.[current]?.altText?.trim();

		// Calculate the number of decorative images after this action
		const currentDecorativeCount = (altTextData?.[type] || []).filter(
			(itm) => itm?.makeDecorative === true,
		).length;
		const numOfImages = isChecking
			? currentDecorativeCount + 1
			: Math.max(0, currentDecorativeCount - 1);

		// Determine if we're in bulk mode
		const isBulkMode =
			currentGeneratingIndex !== null && currentGeneratingIndex !== undefined;

		if (isChecking) {
			updateData({
				makeDecorative: true,
				apiId: null,
				resolved: false,
				hasValidAltText: true,
				isDraft: false,
				selected: true,
			});
			speak(__('Image marked as decorative', 'pojo-accessibility'), 'polite');
			mixpanelService.sendEvent(mixpanelEvents.markAsDecorativeSelected, {
				category_name: BLOCKS.altText,
				type: isBulkMode ? 'bulk' : 'single',
				num_of_images: numOfImages,
				action_type: 'mark',
			});
		} else {
			const hasAltText = !!currentAltText;
			updateData({
				makeDecorative: false,
				apiId: null,
				resolved: false,
				hasValidAltText: hasAltText,
				isDraft: false,
				selected: hasAltText,
			});
			speak(__('Image unmarked as decorative', 'pojo-accessibility'), 'polite');
			mixpanelService.sendEvent(mixpanelEvents.markAsDecorativeSelected, {
				category_name: BLOCKS.altText,
				type: isBulkMode ? 'bulk' : 'single',
				num_of_images: numOfImages,
				action_type: 'undo',
			});
		}
	};

	const handleChange = (e) => {
		const wasValidBefore = altTextData?.[type]?.[current]?.hasValidAltText;

		if (!altTextData?.[type]?.[current]?.isDraft) {
			savedAltTextRef.current = altTextData?.[type]?.[current]?.altText || '';
		}

		updateData({
			altText: e.target.value,
			apiId: null,
			resolved: false,
			isDraft: true,
			hasValidAltText: false,
			selected: wasValidBefore
				? false
				: altTextData?.[type]?.[current]?.selected,
		});
	};

	const handleSave = () => {
		const altText = altTextData?.[type]?.[current]?.altText?.trim();
		if (altText) {
			savedAltTextRef.current = altText;
			updateData({
				hasValidAltText: true,
				isDraft: false,
				selected: true,
			});
			speak(__('Alt text saved', 'pojo-accessibility'), 'polite');
		}
	};

	const handleCancel = () => {
		const restoredHasValidAlt = !!savedAltTextRef.current;
		updateData({
			altText: savedAltTextRef.current,
			isDraft: false,
			hasValidAltText: restoredHasValidAlt,
			selected: restoredHasValidAlt
				? true
				: altTextData?.[type]?.[current]?.selected,
		});
		speak(__('Changes discarded', 'pojo-accessibility'), 'polite');
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			const fixMethod = altTextData?.[type]?.[current]?.apiId
				? 'AI alt-text'
				: 'Manual alt-text';
			const remediation = await updateAltText(item);
			if (!altTextData?.[type]?.[current]?.resolved) {
				updateData({
					remediation,
					resolved: true,
				});
				isGlobalRef.current = isGlobal;
				setResolved(resolved + 1);
			}

			if (altTextData?.[type]?.[current]?.apiId) {
				mixpanelService.sendEvent(mixpanelEvents.aiSuggestionAccepted, {
					element_selector: item.path.dom,
					image_src: item.node?.src,
					final_text: altTextData?.[type]?.[current]?.altText,
					credit_used: 1,
				});
			}
			mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
				fix_method: altTextData?.[type]?.[current]?.makeDecorative
					? 'Mark as decorative'
					: fixMethod,
				issue_type: item.message,
				category_name: BLOCKS.altText,
				page_url: window.ea11yScannerData?.pageData?.url,
				is_global: isGlobal ? 'yes' : 'no',
			});
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdate = async () => {
		const find = getOuterHtmlByXpath(
			item.path.dom,
			item.data?.attribute_name
				? `${item.data.attribute_name}=" ${item.data.attribute_value}"`
				: '',
		);
		try {
			setLoading(true);
			const remediation = altTextData?.[type]?.[current]?.remediation;
			const id = item.id || remediation.id;
			const data = item.data || JSON.parse(remediation.content);
			const strContent = JSON.stringify({
				...data,
				...makeAttributeData(),
				find,
			});
			await APIScanner.updateRemediationContent({
				url: window?.ea11yScannerData?.pageData?.url,
				id,
				content: strContent,
				global: isGlobal,
			});

			isGlobalRef.current = isGlobal;
			setIsManageChanged(true);
			void updateRemediationList();
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const sendMixpanelEvent = (text) => {
		const isBulkMode =
			currentGeneratingIndex !== null && currentGeneratingIndex !== undefined;
		mixpanelService.sendEvent(mixpanelEvents.fixWithAiButtonClicked, {
			issue_type: item.message,
			rule_id: item.ruleId,
			wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
			category_name: BLOCKS.altText,
			ai_text_response: text,
			page_url: window.ea11yScannerData?.pageData?.url,
			type: isBulkMode ? 'bulk' : 'single',
		});
	};

	const getAiText = async () => {
		setLoadingAiText(true);
		try {
			const aiData = await generateAiAltText(item);
			updateData({
				...aiData,
				resolved: false,
				hasValidAltText: true,
				isDraft: false,
				selected: true,
			});
			speak(
				__('Alt text generated successfully', 'pojo-accessibility'),
				'polite',
			);
			sendMixpanelEvent(aiData.altText);
		} catch (e) {
			console.log(e);

			let errorMessage;

			if (e?.code === 'quota_exceeded') {
				errorMessage =
					e?.message ||
					__(
						'AI credits quota has been exceeded. Please upgrade your plan or wait for the next billing cycle.',
						'pojo-accessibility',
					);
			} else if (e?.code === 'quota_api_error') {
				errorMessage =
					e?.message ||
					__(
						'Quota API error. Try again after sometime.',
						'pojo-accessibility',
					);
			} else {
				errorMessage = __('An error occurred.', 'pojo-accessibility');
			}

			error(errorMessage);
			speak(errorMessage, 'assertive');
		} finally {
			setLoadingAiText(false);
		}
	};

	const generateAltText = async () => {
		if (altTextData?.[type]?.[current]?.aiText?.length) {
			const index =
				altTextData?.[type]?.[current]?.aiTextIndex + 1 <
				altTextData?.[type]?.[current]?.aiText?.length
					? altTextData?.[type]?.[current]?.aiTextIndex + 1
					: 0;

			updateData({
				altText: altTextData?.[type]?.[current]?.aiText[index],
				aiTextIndex: index,
				resolved: false,
			});

			speak(
				__('Alternative suggestion loaded', 'pojo-accessibility'),
				'polite',
			);
			sendMixpanelEvent(altTextData?.[type]?.[current]?.aiText[index]);
		} else {
			await getAiText();
		}
	};

	const attrData = makeAttributeData();

	const isSubmitDisabled = isManage
		? attrData.attribute_value === item.data.attribute_value &&
			attrData.attribute_name === item.data.attribute_name &&
			isGlobal === item.global
		: (!altTextData?.[type]?.[current]?.makeDecorative &&
				!altTextData?.[type]?.[current]?.altText) ||
			(altTextData?.[type]?.[current]?.resolved &&
				altTextData?.[type]?.[current]?.isGlobal === isGlobalRef.current) ||
			loading;

	return {
		isGlobal,
		setIsGlobal,
		loadingAiText,
		data: altTextData?.[type],
		isSubmitDisabled,
		loading,
		handleCheck,
		handleChange,
		handleSave,
		handleCancel,
		handleSubmit,
		handleUpdate,
		generateAltText,
		updateData,
	};
};

useAltTextForm.propTypes = {
	current: PropTypes.number.isRequired,
	item: scannerItem.isRequired,
};

export const submitAltTextRemediation = async ({
	item,
	altText,
	makeDecorative,
	isGlobal,
	apiId,
	currentScanId,
	updateRemediationList,
}) => {
	const makeAttributeData = () => {
		if (makeDecorative) {
			return {
				attribute_name: 'role',
				attribute_value: 'presentation',
			};
		}

		if (item.node.tagName === 'svg') {
			return {
				attribute_name: 'aria-label',
				attribute_value: altText,
			};
		}

		return {
			attribute_name: 'alt',
			attribute_value: altText,
		};
	};

	const match = item.node.className.toString().match(/wp-image-(\d+)/);
	const finalAltText = !makeDecorative ? altText : '';
	const find = item.snippet;

	try {
		if (match && item.node.tagName !== 'svg') {
			void APIScanner.submitAltText(item.node.src, finalAltText);
		}
		const response = await APIScanner.submitRemediation({
			url: window?.ea11yScannerData?.pageData.url,
			remediation: {
				...makeAttributeData(),
				action: 'add',
				xpath: item.path.dom,
				find,
				category: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
				type: 'ATTRIBUTE',
			},
			global: isGlobal,
			rule: item.ruleId,
			group: BLOCKS.altText,
			apiId,
		});

		await APIScanner.resolveIssue(currentScanId);
		void updateRemediationList();
		return response.remediation;
	} catch (e) {
		console.warn(e);
		throw e;
	}
};
