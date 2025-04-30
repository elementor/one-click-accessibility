import clipboardCopy from 'clipboard-copy';
import PropTypes from 'prop-types';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { useState } from '@wordpress/element';

export const useManualFixForm = ({ item, current }) => {
	const { openedBlock, manualData, setManualData, resolved, setResolved } =
		useScannerWizardContext();

	const [copied, setCopied] = useState(false);

	const {} = item;

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

	const markResolved = () => {
		updateData({ resolved: true });
		setResolved(resolved + 1);
	};

	const copyToClipboard = (snippet) => async () => {
		await clipboardCopy(snippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 5000);
	};

	return {
		copied,
		markResolved,
		copyToClipboard,
	};
};

useManualFixForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
};
