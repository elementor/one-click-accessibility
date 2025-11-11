import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useGlobalManageActions = () => {
	const { error } = useToastNotification();
	const {
		openedBlock,
		globalRemediations,
		sortedGlobalRemediation,
		setLoading,
		updateRemediationList,
		setIsManageChanged,
	} = useScannerWizardContext();

	const [activeRequest, setActiveRequest] = useState(false);

	const sendUpdateEvent = (active, group, context) => {
		mixpanelService.sendEvent(
			mixpanelEvents[active ? 'remediationEnabled' : 'remediationDisabled'],
			{
				action_type: active ? 'enable_all' : 'disable_all',
				remediations_amount: group
					? sortedGlobalRemediation[group]
					: globalRemediations?.length,
				category: group || 'all',
				context,
				is_global: 'yes',
			},
		);
	};

	const sendSpecificEvent = (active, rule, context) => {
		mixpanelService.sendEvent(
			mixpanelEvents[active ? 'remediationEnabled' : 'remediationDisabled'],
			{
				action_type: active ? 'enable_specific' : 'disable_specific',
				category_name: openedBlock,
				issue_type: rule,
				is_global: 'yes',
				context,
			},
		);
	};

	const setRemediationAsGlobal = async (id) => {
		try {
			setLoading(true);
			await APIScanner.setRemediationAsGlobal({ id });
			setIsManageChanged(true);
			mixpanelService.sendEvent(
				mixpanelEvents.applyGlobalFixConfirmationClicked,
			);
			await updateRemediationList();
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const updateGlobalRemediationForPage = async (id, active, rule) => {
		try {
			setActiveRequest(true);
			await APIScanner.updateGlobalRemediationForPage({
				url: window?.ea11yScannerData?.pageData?.url,
				id,
				active,
			});
			setIsManageChanged(true);
			await updateRemediationList();
			sendSpecificEvent(active, rule, 'current_page');
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	const updateGlobalRemediationForAllPages = async (id, active, rule) => {
		try {
			setActiveRequest(true);
			await APIScanner.updateGlobalRemediationForAllPages({
				id,
				active,
			});
			setIsManageChanged(true);
			await updateRemediationList();
			sendSpecificEvent(active, rule, 'all_pages');
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setActiveRequest(false);
		}
	};

	const deleteGlobalRemediation = async (id, rule) => {
		try {
			setActiveRequest(true);
			await APIScanner.deleteGlobalRemediation({
				id,
			});

			mixpanelService.sendEvent(mixpanelEvents.remediationRemoved, {
				action_type: 'remove_specific',
				category_name: openedBlock,
				issue_type: rule,
				is_global: 'yes',
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
			sendUpdateEvent(active, group, 'current_page');
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
			sendUpdateEvent(active, group, 'all_pages');
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
			sendUpdateEvent(active, 'all', 'current_page');
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
			sendUpdateEvent(active, 'all', 'all_pages');
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
			mixpanelService.sendEvent(mixpanelEvents.remediationRemoved, {
				action_type: 'remove_all',
				remediations_amount: group
					? sortedGlobalRemediation[group]
					: globalRemediations?.length,
				category: group || 'all',
				is_global: 'yes',
			});
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
