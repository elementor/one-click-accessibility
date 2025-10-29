import { useToastNotification } from '@ea11y-apps/global/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { removeExistingFocus } from '@ea11y-apps/scanner/utils/focus-on-element';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export const useManageActions = (current = null) => {
	const { error } = useToastNotification();
	const {
		remediations,
		sortedRemediation,
		openedBlock,
		setSortedRemediation,
		setLoading,
		updateRemediationList,
		setIsManageChanged,
	} = useScannerWizardContext();

	const [activeRequest, setActiveRequest] = useState(false);

	const updateAllRemediationForPage = (active, group) => async () => {
		try {
			setLoading(true);
			await APIScanner.updateRemediationStatusForPage({
				url: window?.ea11yScannerData?.pageData?.url,
				active,
				group,
			});
			setIsManageChanged(true);
			await updateRemediationList();
			mixpanelService.sendEvent(
				mixpanelEvents[active ? 'remediationEnabled' : 'remediationDisabled'],
				{
					action_type: active ? 'enable_all' : 'disable_all',
					remediations_amount: group
						? sortedRemediation[group]
						: remediations?.length,
					category: group || 'all',
					is_global: 'no',
				},
			);
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			setLoading(false);
		}
	};

	const deleteAllRemediationForPage = async (group) => {
		try {
			setLoading(true);
			await APIScanner.deleteRemediationForPage({
				url: window?.ea11yScannerData?.pageData?.url,
				group,
			});

			mixpanelService.sendEvent(mixpanelEvents.remediationRemoved, {
				action_type: 'remove_all',
				remediations_amount: group
					? sortedRemediation[group]
					: remediations?.length,
				category: group || 'all',
				is_global: 'no',
			});

			if (group) {
				await updateRemediationList();
			} else {
				const url = new URL(window.location.href);
				url.searchParams.delete('open-ea11y-assistant');
				url.searchParams.delete('open-ea11y-assistant-src');
				url.searchParams.append('open-ea11y-assistant', '1');

				window.location.assign(url);
			}
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
				id: current.id,
			});
			await updateRemediationList();
			setIsManageChanged(true);
			mixpanelService.sendEvent(
				mixpanelEvents[active ? 'remediationEnabled' : 'remediationDisabled'],
				{
					action_type: active ? 'enable_specific' : 'disable_specific',
					category_name: openedBlock,
					issue_type: current.rule,
				},
			);
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
				id: current.id,
			});
			await updateRemediationList();
			setIsManageChanged(true);
			mixpanelService.sendEvent(mixpanelEvents.remediationRemoved, {
				action_type: 'remove_specific',
				category_name: openedBlock,
				issue_type: current.rule,
				is_global: 'no',
			});
		} catch (e) {
			console.error(e);
			error(__('An error occurred.', 'pojo-accessibility'));
		} finally {
			removeExistingFocus();
			setActiveRequest(false);
		}
	};

	const editRemediation = async (content) => {
		try {
			setActiveRequest(true);
			const strContent = JSON.stringify(content);
			await APIScanner.updateRemediationContent({
				url: window?.ea11yScannerData?.pageData?.url,
				id: current.id,
				content: strContent,
			});
			const updated = sortedRemediation[openedBlock].map((item) =>
				item.id === current.id ? { ...item, content: strContent } : item,
			);
			setSortedRemediation({
				...sortedRemediation,
				[openedBlock]: updated,
			});
			setIsManageChanged(true);
			mixpanelService.sendEvent(mixpanelEvents.applyFixButtonClicked, {
				fix_method: 'manual',
				snippet_content: strContent,
				category_name: openedBlock,
				source: 'remediation',
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
