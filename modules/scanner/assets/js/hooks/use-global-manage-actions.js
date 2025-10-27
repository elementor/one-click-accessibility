import { useToastNotification } from '@ea11y-apps/global/hooks';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useGlobalManageActions = () => {
	const { error } = useToastNotification();
	const { setLoading, updateRemediationList, setIsManageChanged } =
		useScannerWizardContext();

	const [activeRequest, setActiveRequest] = useState(false);

	const setRemediationAsGlobal = async (id) => {
		try {
			setLoading(true);
			await APIScanner.setRemediationAsGlobal({ id });
			setIsManageChanged(true);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const updateGlobalRemediationForPage = async (id, active) => {
		try {
			setActiveRequest(true);
			await APIScanner.updateGlobalRemediationForPage({
				url: window?.ea11yScannerData?.pageData?.url,
				id,
				active,
			});
			setIsManageChanged(true);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	const updateGlobalRemediationForAllPages = async (id, active) => {
		try {
			setActiveRequest(true);
			await APIScanner.updateGlobalRemediationForAllPages({
				id,
				active,
			});
			setIsManageChanged(true);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	const deleteGlobalRemediation = async (id) => {
		try {
			setActiveRequest(true);
			await APIScanner.deleteGlobalRemediation({
				id,
			});

			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	const updateGlobalRemediationGroupForPage = async (active, group) => {
		try {
			setLoading(true);
			await APIScanner.updateGlobalRemediationGroupForPage({
				url: window?.ea11yScannerData?.pageData?.url,
				active,
				group,
			});
			setIsManageChanged(true);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const updateGlobalRemediationGroupForAllPages = async (active, group) => {
		try {
			setLoading(true);
			await APIScanner.updateGlobalRemediationGroupForAllPages({
				active,
				group,
			});
			setIsManageChanged(true);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const updateAllGlobalRemediationForPage = async (active) => {
		try {
			setLoading(true);
			await APIScanner.updateAllGlobalRemediationForPage({
				url: window?.ea11yScannerData?.pageData?.url,
				active,
			});
			setIsManageChanged(true);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const updateAllGlobalRemediationForAllPages = async (active) => {
		try {
			setLoading(true);
			await APIScanner.updateAllGlobalRemediationForAllPages({
				active,
			});
			setIsManageChanged(true);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const deleteGlobalRemediations = async (group) => {
		try {
			setLoading(true);
			await APIScanner.deleteGlobalRemediations({
				group,
			});

			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	return {
		activeRequest,
		setRemediationAsGlobal,
		updateGlobalRemediationForPage,
		updateGlobalRemediationForAllPages,
		updateGlobalRemediationGroupForPage,
		updateGlobalRemediationGroupForAllPages,
		updateAllGlobalRemediationForPage,
		updateAllGlobalRemediationForAllPages,
		deleteGlobalRemediation,
		deleteGlobalRemediations,
	};
};
