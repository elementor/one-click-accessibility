import PropTypes from 'prop-types';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import useScannerSettings from '@ea11y-apps/scanner/hooks/use-scanner-settings';
import {
	getHeadingXpath,
	getPageHeadingsTree,
	keyForNode,
} from '@ea11y-apps/scanner/utils/page-headings';
import {
	calculateStats,
	validateHeadings,
} from '@ea11y-apps/scanner/utils/validate-headings';
import { createContext, useContext, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useScannerWizardContext } from './scanner-wizard-context';

export const HeadingStructureContext = createContext({});

export const HeadingStructureContextProvider = ({ children }) => {
	/** Important to keep it true by default. */
	const loadingState = useState(true);
	const errorState = useState('');
	const pageHeadingsState = useState([]);
	const pageHeadingValidationStatsState = useState({});
	const expandedKeyState = useState(null);

	return (
		<HeadingStructureContext.Provider
			value={{
				loadingState,
				errorState,
				pageHeadingsState,
				pageHeadingValidationStatsState,
				expandedKeyState,
			}}
		>
			{children}
		</HeadingStructureContext.Provider>
	);
};

HeadingStructureContextProvider.propTypes = {
	children: PropTypes.node,
};

export const useHeadingStructureContext = () => {
	const {
		loadingState,
		errorState,
		pageHeadingsState,
		pageHeadingValidationStatsState,
		expandedKeyState,
	} = useContext(HeadingStructureContext);
	const { currentScanId } = useScannerWizardContext();
	const { dismissedHeadingIssues, pageData } = useScannerSettings();
	const [isLoading, setIsLoading] = loadingState;
	const [error, setError] = errorState;
	const [pageHeadings, setPageHeadings] = pageHeadingsState;
	const [validationStats, setValidationStats] = pageHeadingValidationStatsState;
	const [expandedKey, setExpandedKey] = expandedKeyState;

	const updateHeadingsTree = () => {
		const updatedHeadings = validateHeadings(
			getPageHeadingsTree(),
			dismissedHeadingIssues,
		);

		setPageHeadings(updatedHeadings);
		setValidationStats(calculateStats(updatedHeadings));

		setIsLoading(false);
	};

	const onHeadingWarningDismiss = async ({ node }) => {
		setIsLoading(true);
		setError('');

		try {
			const xpath = getHeadingXpath(node);

			if (!node) {
				throw new TypeError();
			}

			await APIScanner.dismissHeadingIssue({
				pageId: pageData.object_id,
				xpath,
			});

			window.ea11yScannerData.dismissedHeadingIssues.push(xpath);

			await APIScanner.resolveIssue(currentScanId);

			return true;
		} catch (e) {
			console.error('onHeadingWarningDismiss(): ', e);
			setError(__('An error occurred.', 'pojo-accessibility'));

			return false;
		}
	};

	const onHeadingLevelUpdate = async ({ node, newLevel, violation }) => {
		setIsLoading(true);
		setError('');

		try {
			const xpath = getHeadingXpath(node);

			if (!node || !pageData.url || !newLevel) {
				throw new TypeError();
			}

			await APIScanner.setHeadingLevel({
				url: pageData.url,
				level: newLevel,
				xpath,
				rule: violation,
			});

			await APIScanner.resolveIssue(currentScanId);
			setIsLoading(false);

			return true;
		} catch (e) {
			console.error('onHeadingLevelUpdate(): ', e);
			setError(__('An error occurred.', 'pojo-accessibility'));
			setIsLoading(false);

			return false;
		}
	};

	const isHeadingExpanded = (node) => {
		return keyForNode(node) === expandedKey;
	};

	const toggleHeading = (node) => {
		const key = keyForNode(node);
		setExpandedKey((prev) => (prev === key ? null : key));
	};

	const collapseHeading = () => {
		setExpandedKey(null);
	};

	return {
		isLoading,
		error,
		pageHeadings,
		validationStats,
		setPageHeadings,
		expandedKey,
		updateHeadingsTree,
		onHeadingWarningDismiss,
		onHeadingLevelUpdate,
		isHeadingExpanded,
		toggleHeading,
		collapseHeading,
	};
};
