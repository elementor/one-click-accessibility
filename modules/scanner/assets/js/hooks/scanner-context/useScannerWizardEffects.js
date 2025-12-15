import { BLOCKS, MANAGE_URL_PARAM } from '@ea11y-apps/scanner/constants';
import { scannerWizard } from '@ea11y-apps/scanner/services/scanner-wizard';
import {
	focusOnElement,
	removeExistingFocus,
} from '@ea11y-apps/scanner/utils/focus-on-element';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';
import { useEffect } from '@wordpress/element';

export default function useScannerWizardEffects(state, actions) {
	const {
		sortedViolations,
		sortedRemediation,
		openIndex,
		openedBlock,
		isManage,
		setRemediations,
		setViolation,
		setIsError,
		setLoading,
	} = state;

	// Focus management when openIndex changes
	useEffect(() => {
		const items = isManage
			? sortedRemediation[openedBlock]
			: sortedViolations[openedBlock];
		if (
			openIndex !== null &&
			sortedViolations[openedBlock]?.length &&
			openIndex < items?.length
		) {
			const element = isManage
				? getElementByXPath(
						JSON.parse(sortedRemediation[openedBlock][openIndex].content)
							?.xpath,
					)
				: sortedViolations[openedBlock][openIndex].node;
			focusOnElement(element);
		} else {
			removeExistingFocus();
		}
	}, [openIndex]);

	// Clear remediations array when no remediation items left
	useEffect(() => {
		if (
			Object.keys(sortedRemediation).every(
				(key) => sortedRemediation[key].length === 0,
			)
		) {
			setRemediations([]);
		}
	}, [sortedRemediation]);

	// compute violation count
	useEffect(() => {
		if (state.results?.summary?.counts) {
			const total = Object.values(sortedViolations).reduce(
				(sum, arr) => sum + arr.length,
				0,
			);
			setViolation(total);
		}
	}, [sortedViolations, state.results]);

	// initial load and scannerWizard logic
	useEffect(() => {
		if (window.ea11yScannerData?.isConnected) {
			setTimeout(() => {
				scannerWizard
					.load()
					.then(() => {
						void actions.getResults();
					})
					.catch(() => {
						setIsError(true);
						setLoading(false);
					});
			}, 500);
			void actions.updateRemediationList();
		} else {
			setLoading(false);
		}
	}, [window.ea11yScannerData?.isConnected]);

	// handle manage param on url change
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get(MANAGE_URL_PARAM) === '1') {
			state.setIsManage(true);
			actions.handleOpenBlock(BLOCKS.management);
		}
	}, [window.location.search]);
}
