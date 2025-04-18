import PropTypes from 'prop-types';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';

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
		console.log(item, current);
		if (!altTextData?.[current]?.resolved) {
			updateData({ resolved: true });
			setResolved(resolved + 1);
		}

		//TODO: add submit logic
	};

	return {
		data: altTextData,
		isSubmitDisabled,
		handleCheck,
		handleChange,
		handleSubmit,
	};
};

useAltTextForm.propTypes = {
	current: PropTypes.number.isRequired,
	item: scannerItem.isRequired,
};
