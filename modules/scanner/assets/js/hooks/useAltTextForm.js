import PropTypes from 'prop-types';
import { useToastNotification } from '@ea11y-apps/global/hooks';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { splitDescriptions } from '@ea11y-apps/scanner/utils/split-ai-response';
import { svgNodeToPngBase64 } from '@ea11y-apps/scanner/utils/svg-node-to-png-base64';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useAltTextForm = ({ current, item }) => {
	const { altTextData, setAltTextData, resolved, setResolved } =
		useScannerWizardContext();
	const { error } = useToastNotification();

	const [loadingAiText, setLoadingAiText] = useState(false);
	//const [aiText, setAiText] = useState([]);

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

	const updateAltText = async () => {
		const match = item.node.className.toString().match(/wp-image-(\d+)/);
		const altText = !altTextData?.[current]?.makeDecorative
			? altTextData?.[current]?.altText
			: '';

		if (match && item.node.tagName !== 'svg') {
			await APIScanner.submitAltText(item.node.src, altText);
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

	const generateAltText = async () => {
		setLoadingAiText(true);

		const data = item.node?.src
			? { image: item.node?.src }
			: { svg: await svgNodeToPngBase64(item.node) };

		try {
			const response = await APIScanner.generateAltText(data);
			const descriptions = splitDescriptions(response.data);
			//setAiText(descriptions);
			if (descriptions[0]) {
				updateData({
					altText: descriptions[0],
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
