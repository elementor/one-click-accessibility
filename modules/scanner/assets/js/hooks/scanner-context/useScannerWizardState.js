import {
	BLOCKS,
	INITIAL_SORTED_VIOLATIONS,
	MANUAL_GROUPS,
} from '@ea11y-apps/scanner/constants';
import { useState } from '@wordpress/element';

const initialAltTextData = { manage: [], main: [] };

export default function useScannerWizardState() {
	const [results, setResults] = useState();
	const [remediations, setRemediations] = useState([]);
	const [sortedViolations, setSortedViolations] = useState(
		INITIAL_SORTED_VIOLATIONS,
	);
	const [sortedRemediation, setSortedRemediation] = useState(
		INITIAL_SORTED_VIOLATIONS,
	);
	const [resolved, setResolved] = useState(0);
	const [currentScanId, setCurrentScanId] = useState(null);
	const [openedBlock, setOpenedBlock] = useState(BLOCKS.main);
	const [loading, setLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const [quotaExceeded, setQuotaExceeded] = useState(false);
	const [isManage, setIsManage] = useState(false);
	const [isManageChanged, setIsManageChanged] = useState(false);
	const [altTextData, setAltTextData] = useState(initialAltTextData);
	const [manualData, setManualData] = useState(structuredClone(MANUAL_GROUPS));
	const [remediationData, setRemediationData] = useState(
		structuredClone(MANUAL_GROUPS),
	);
	const [openIndex, setOpenIndex] = useState(null);
	const [violation, setViolation] = useState(null);

	return {
		// state values
		results,
		remediations,
		sortedViolations,
		sortedRemediation,
		resolved,
		currentScanId,
		openedBlock,
		loading,
		isError,
		quotaExceeded,
		isManage,
		isManageChanged,
		altTextData,
		manualData,
		remediationData,
		openIndex,
		violation,
		// setters
		setResults,
		setRemediations,
		setSortedViolations,
		setSortedRemediation,
		setResolved,
		setCurrentScanId,
		setOpenedBlock,
		setLoading,
		setIsError,
		setQuotaExceeded,
		setIsManage,
		setIsManageChanged,
		setAltTextData,
		setManualData,
		setRemediationData,
		setOpenIndex,
		setViolation,
	};
}
