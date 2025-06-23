import { useToastNotification } from '@ea11y-apps/global/hooks';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useManageActions = (id = null) => {
	const { error } = useToastNotification();
	const {
		sortedRemediation,
		openedBlock,
		setSortedRemediation,
		setLoading,
		updateRemediationList,
	} = useScannerWizardContext();

	const [activeRequest, setActiveRequest] = useState(false);

	const updateAllRemediationForPage = (active) => async () => {
		try {
			setLoading(true);
			await APIScanner.updateRemediationStatusForPage({
				url: window?.ea11yScannerData?.pageData?.url,
				active,
			});
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const deleteAllRemediationForPage = async () => {
		try {
			setLoading(true);
			await APIScanner.deleteRemediationForPage({
				url: window?.ea11yScannerData?.pageData?.url,
			});
			const url = new URL(window.location.href);
			url.searchParams.delete('open-ea11y-assistant');
			url.searchParams.delete('open-ea11y-assistant-src');
			url.searchParams.append('open-ea11y-assistant', '1');

			window.location.assign(url);
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const updateRemediation = (active) => async () => {
		try {
			setActiveRequest(true);
			await APIScanner.updateRemediation({
				url: window?.ea11yScannerData?.pageData?.url,
				active,
				id,
			});
			const updated = sortedRemediation[openedBlock].map((item) =>
				item.id === id ? { ...item, active } : item,
			);
			setSortedRemediation({
				...sortedRemediation,
				[openedBlock]: updated,
			});
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	const deleteRemediation = async () => {
		try {
			setActiveRequest(true);
			await APIScanner.deleteRemediation({
				url: window?.ea11yScannerData?.pageData?.url,
				id,
			});
			const updated = sortedRemediation[openedBlock].flatMap((item) =>
				item.id !== id ? item : [],
			);
			setSortedRemediation({
				...sortedRemediation,
				[openedBlock]: updated,
			});
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	const editRemediation = async (content) => {
		try {
			setActiveRequest(true);
			const strContent = JSON.stringify(content);
			await APIScanner.updateRemediationContent({
				url: window?.ea11yScannerData?.pageData?.url,
				id,
				content: strContent,
			});
			const updated = sortedRemediation[openedBlock].map((item) =>
				item.id === id ? { ...item, content: strContent } : item,
			);
			setSortedRemediation({
				...sortedRemediation,
				[openedBlock]: updated,
			});
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	return {
		activeRequest,
		updateAllRemediationForPage,
		deleteAllRemediationForPage,
		updateRemediation,
		deleteRemediation,
		editRemediation,
	};
};
