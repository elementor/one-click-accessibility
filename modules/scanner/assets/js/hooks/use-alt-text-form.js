import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { BLOCKS } from '@ea11y-apps/scanner/constants';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { getOuterHtmlByXpath } from '@ea11y-apps/scanner/utils/get-outer-html-by-xpath';
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
		isManage,
		sortedRemediation,
		setSortedRemediation,
		openedBlock,
		setIsManageChanged,
	} = useScannerWizardContext();
	const { error } = useToastNotification();

	const [loadingAiText, setLoadingAiText] = useState(false);
	const [loading, setLoading] = useState(false);
	const [firstOpen, setFirstOpen] = useState(true);
	const [isGlobal, setIsGlobal] = useState(false);

	const type = isManage ? 'manage' : 'main';

	useEffect(() => {
		if (isManage) {
			updateData({
				makeDecorative: item.data.attribute_name === 'role',
				altText:
					item.data.attribute_name !== 'role' ? item.data.attribute_value : '',
			});
		}
	}, [isManage]);

	useEffect(() => {
		setIsGlobal(item.global || false);
	}, [current]);

	useEffect(() => {
		if (!isManage && !firstOpen && isResolved(BLOCKS.altText)) {
			removeExistingFocus();
			setOpenedBlock(BLOCKS.main);
		}
		setFirstOpen(false);
	}, [altTextData?.[type]]);

	const updateData = (data) => {
		const updData = [...altTextData?.[type]];
		if (altTextData?.[type]?.[current]?.resolved && !data.resolved) {
			setResolved(resolved - 1);
		}
		updData[current] = {
			...(altTextData?.[type]?.[current] || {}),
			...data,
		};
		setAltTextData({
			...altTextData,
			[type]: updData,
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
			await APIScanner.submitRemediation({
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
			const fixMethod = altTextData?.[type]?.[current]?.apiId
				? 'AI alt-text'
				: 'Manual alt-text';
			await updateAltText(item);
			if (!altTextData?.[type]?.[current]?.resolved) {
				updateData({ resolved: true });
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
			`${item.data.attribute_name}=" ${item.data.attribute_value}"`,
		);
		try {
			setLoading(true);
			const strContent = JSON.stringify({
				...item.data,
				...makeAttributeData(),
				find,
			});
			await APIScanner.updateRemediationContent({
				url: window?.ea11yScannerData?.pageData?.url,
				id: item.id,
				content: strContent,
				global: isGlobal,
			});
			const updated = sortedRemediation[openedBlock].map((remediation) =>
				item.id === remediation.id
					? { ...remediation, content: strContent }
					: remediation,
			);

			setSortedRemediation({
				...sortedRemediation,
				[openedBlock]: updated,
			});
			setIsManageChanged(true);
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
			altTextData?.[type]?.[current]?.resolved ||
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
		handleSubmit,
		handleUpdate,
		generateAltText,
	};
};

useAltTextForm.propTypes = {
	current: PropTypes.number.isRequired,
	item: scannerItem.isRequired,
};
