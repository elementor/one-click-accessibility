import PropTypes from 'prop-types';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { imageToBase64 } from '@ea11y-apps/scanner/utils/image-to-base64';

export const useAltTextForm = ({ current, item }) => {
	const { altTextData, setAltTextData, resolved, setResolved } =
		useScannerWizardContext();

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
		const base64Image = imageToBase64(item.node);
		return await APIScanner.generateAltText(base64Image);
	};

	return {
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
