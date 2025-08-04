import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { splitDescriptions } from '@ea11y-apps/scanner/utils/split-ai-response';
import {
	convertSvgToPngBase64,
	svgNodeToPngBase64,
} from '@ea11y-apps/scanner/utils/svg-to-png-base64';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

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
	} = useScannerWizardContext();
	const { error } = useToastNotification();

	const [loadingAiText, setLoadingAiText] = useState(false);
	const [loading, setLoading] = useState(false);
	const [firstOpen, setFirstOpen] = useState(true);

	const isSubmitDisabled =
		(!altTextData?.[current]?.makeDecorative &&
			!altTextData?.[current]?.altText) ||
		altTextData?.[current]?.resolved ||
		loading;

	useEffect(() => {
		if (!firstOpen && isResolved(BLOCKS.altText)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
		setFirstOpen(false);
	}, [altTextData]);

	const updateData = (data) => {
		const updData = [...altTextData];
		if (altTextData?.[current]?.resolved && !data.resolved) {
			setResolved(resolved - 1);
		}
		updData[current] = {
			...(altTextData?.[current] || {}),
			...data,
		};
		setAltTextData(updData);
	};

	const makeAttributeData = () => {
		if (altTextData?.[current]?.makeDecorative) {
			item.node.setAttribute('role', 'presentation');
			return {
				attribute_name: 'role',
				attribute_value: 'presentation',
			};
		}
		if (item.node.tagName === 'svg') {
			item.node.setAttribute('aria-label', altTextData?.[current]?.altText);
			return {
				attribute_name: 'aria-label',
				attribute_value: altTextData?.[current]?.altText,
			};
		}

		item.node.setAttribute('alt', altTextData?.[current]?.altText);
		return {
			attribute_name: 'alt',
			attribute_value: altTextData?.[current]?.altText,
		};
	};

	const updateAltText = async () => {
		const match = item.node.className.toString().match(/wp-image-(\d+)/);
		const altText = !altTextData?.[current]?.makeDecorative
			? altTextData?.[current]?.altText
			: '';

		try {
			if (match && item.node.tagName !== 'svg') {
				void APIScanner.submitAltText(item.node.src, altText);
			}
			await APIScanner.submitRemediation({
				url: window?.ea11yScannerData?.pageData.url,
				remediation: {
					...makeAttributeData(),
					action: 'add',
					xpath: item.path.dom,
					category: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
					type: 'ATTRIBUTE',
				},
				rule: item.ruleId,
				group: BLOCKS.altText,
				apiId: altTextData?.[current]?.apiId,
			});

			await APIScanner.resolveIssue(currentScanId);
			void updateRemediationList();
		} catch (e) {
			console.warn(e);
		}
	};

	const handleCheck = (e) => {
		updateData({
			makeDecorative: e.target.checked,
			apiId: null,
			resolved: false,
		});
		if (e.target.checked) {
			mixpanelService.sendEvent(mixpanelEvents.markAsDecorativeSelected, {
				category_name: BLOCKS.altText,
			});
		}
	};

	const handleChange = (e) => {
		updateData({
			altText: e.target.value,
			apiId: null,
			resolved: false,
		});
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			const fixMethod = altTextData?.[current]?.apiId
				? 'AI alt-text'
				: 'Manual alt-text';
			await updateAltText(item);
			if (!altTextData?.[current]?.resolved) {
				updateData({ resolved: true });
				setResolved(resolved + 1);
			}

			if (altTextData?.[current]?.apiId) {
				mixpanelService.sendEvent(mixpanelEvents.aiSuggestionAccepted, {
					element_selector: item.path.dom,
					image_src: item.node?.src,
					final_text: altTextData?.[current]?.altText,
					credit_used: 1,
				});
			}
			mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
				fix_method: altTextData?.[current]?.makeDecorative
					? 'Mark as decorative'
					: fixMethod,
				issue_type: item.message,
				category_name: BLOCKS.altText,
				page_url: window.ea11yScannerData?.pageData?.url,
			});
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	const getPayload = async () => {
		if (item.node?.src) {
			return item.node.src.toLowerCase().endsWith('.svg')
				? { svg: await convertSvgToPngBase64(item.node.src) }
				: { image: item.node.src };
		}
		return { svg: await svgNodeToPngBase64(item.node) };
	};

	const sendMixpanelEvent = (text) => {
		mixpanelService.sendEvent(mixpanelEvents.fixWithAiButtonClicked, {
			issue_type: item.message,
			rule_id: item.ruleId,
			wcag_level: item.reasonCategory.match(/\((AAA?|AA?|A)\)/)?.[1] || '',
			category_name: BLOCKS.altText,
			ai_text_response: text,
			page_url: window.ea11yScannerData?.pageData?.url,
		});
	};

	const getAiText = async () => {
		setLoadingAiText(true);
		const data = await getPayload();
		try {
			const result = await APIScanner.generateAltText(data);
			const descriptions = splitDescriptions(result.data.response);
			if (descriptions[0]) {
				updateData({
					altText: descriptions[0],
					aiText: descriptions,
					apiId: result.data.apiId,
					aiTextIndex: 0,
					resolved: false,
				});
				sendMixpanelEvent(descriptions[0]);
			}
		} catch (e) {
			console.log(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoadingAiText(false);
		}
	};

	const generateAltText = async () => {
		if (altTextData?.[current]?.aiText?.length) {
			const index =
				altTextData?.[current]?.aiTextIndex + 1 <
				altTextData?.[current]?.aiText?.length
					? altTextData?.[current]?.aiTextIndex + 1
					: 0;

			updateData({
				altText: altTextData?.[current]?.aiText[index],
				aiTextIndex: index,
				resolved: false,
			});

			sendMixpanelEvent(altTextData?.[current]?.aiText[index]);
		} else {
			await getAiText();
		}
	};

	return {
		loadingAiText,
		data: altTextData,
		isSubmitDisabled,
		loading,
		handleCheck,
		handleChange,
		handleSubmit,
		generateAltText,
	};
};

useAltTextForm.propTypes = {
	current: PropTypes.number.isRequired,
	item: scannerItem.isRequired,
};
