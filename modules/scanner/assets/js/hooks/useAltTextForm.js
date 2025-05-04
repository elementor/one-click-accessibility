import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { splitDescriptions } from '@ea11y-apps/scanner/utils/split-ai-response';
import {
	convertSvgToPngBase64,
	svgNodeToPngBase64,
} from '@ea11y-apps/scanner/utils/svg-to-png-base64';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useAltTextForm = ({ current, item }) => {
	const { altTextData, setAltTextData, resolved, setResolved } =
		useScannerWizardContext();
	const { error } = useToastNotification();

	const [loadingAiText, setLoadingAiText] = useState(false);

	const isSubmitDisabled =
		(!altTextData?.[current]?.makeDecorative &&
			!altTextData?.[current]?.altText) ||
		altTextData?.[current]?.resolved;

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

		if (match && item.node.tagName !== 'svg') {
			await APIScanner.submitAltText(item.node.src, altText);
		} else {
			await APIScanner.submitRemediation({
				url: window?.ea11yScannerData?.pageData.url,
				remediation: {
					...makeAttributeData(),
					action: 'add',
					xpath: item.path.dom,
					type: 'ATTRIBUTE',
				},
			});
		}
	};

	const handleCheck = (e) => {
		updateData({
			makeDecorative: e.target.checked,
			resolved: false,
		});
	};

	const handleChange = (e) => {
		updateData({
			altText: e.target.value,
			resolved: false,
		});
	};

	const handleSubmit = async () => {
		await updateAltText(item);
		if (!altTextData?.[current]?.resolved) {
			updateData({ resolved: true });
			setResolved(resolved + 1);
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

	const getAiText = async () => {
		setLoadingAiText(true);
		const data = await getPayload();
		try {
			const response = await APIScanner.generateAltText(data);
			const descriptions = splitDescriptions(response.data);
			if (descriptions[0]) {
				updateData({
					altText: descriptions[0],
					aiText: descriptions,
					aiTextIndex: 0,
					resolved: false,
				});
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
			const index = altTextData?.[current]?.aiTextIndex + 1;

			if (altTextData?.[current]?.aiText[index]) {
				updateData({
					altText: altTextData?.[current]?.aiText[index],
					aiTextIndex: index,
					resolved: false,
				});
			}
		} else {
			await getAiText();
		}
	};

	return {
		loadingAiText,
		data: altTextData,
		isSubmitDisabled,
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
