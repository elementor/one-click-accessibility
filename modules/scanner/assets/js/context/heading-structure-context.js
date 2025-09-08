import PropTypes from 'prop-types';
import { APIScanner } from '@ea11y-apps/scanner/api/APIScanner';
import useScannerSettings from '@ea11y-apps/scanner/hooks/use-scanner-settings';
import {
	getPageHeadings,
	getHeadingXpath,
} from '@ea11y-apps/scanner/utils/page-headings';
import {
	validateHeadings,
	calculateStats,
} from '@ea11y-apps/scanner/utils/validate-headings';
import { createContext, useContext, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useScannerWizardContext } from './scanner-wizard-context';

export const HeadingStructureContext = createContext({});

export const HeadingStructureContextProvider = ({ children }) => {
	const loadingState = useState(true);
	const errorState = useState('');
	const pageHeadingsState = useState([]);
	const pageHeadingValidationStatsState = useState({});
	const expandedNodeState = useState(null);

	return (
		<HeadingStructureContext.Provider
			value={{
				loadingState,
				errorState,
				pageHeadingsState,
				pageHeadingValidationStatsState,
				expandedNodeState,
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
		expandedNodeState,
	} = useContext(HeadingStructureContext);
	const { currentScanId } = useScannerWizardContext();
	const { dismissedHeadingIssues, pageData } = useScannerSettings();
	const [isLoading, setIsLoading] = loadingState;
	const [error, setError] = errorState;
	const [pageHeadings, setPageHeadings] = pageHeadingsState;
	const [validationStats, setValidationStats] = pageHeadingValidationStatsState;
	const [expandedNode, setExpandedNode] = expandedNodeState;

	const updateHeadingsTree = () => {
		const updatedHeadings = validateHeadings(
			getPageHeadings(),
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
			setError(__('An error occurred.', 'pojo-accessibility'));
			setIsLoading(false);

			return false;
		}
	};

	const isHeadingExpanded = (node) => {
		return node === expandedNode;
	};

	const toggleHeading = (node) => {
		if (expandedNode === node) {
			setExpandedNode(null);
		} else {
			setExpandedNode(node);
		}
	};

	const collapseHeading = () => {
		setExpandedNode(null);
	};

	return {
		isLoading,
		error,
		pageHeadings,
		validationStats,
		setPageHeadings,
		updateHeadingsTree,
		onHeadingWarningDismiss,
		onHeadingLevelUpdate,
		isHeadingExpanded,
		toggleHeading,
		collapseHeading,
	};
};
