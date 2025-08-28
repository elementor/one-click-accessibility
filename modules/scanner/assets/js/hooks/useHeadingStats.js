import { useScannerWizardContext } from '@ea11y-apps/scanner/context/scanner-wizard-context';
import { getPageHeadings } from '@ea11y-apps/scanner/utils/page-headings';
import { useMemo } from '@wordpress/element';

/**
 * Custom hook to calculate heading structure statistics
 *
 * Analyzes the sortedViolations.headingStructure array to count:
 * - Violations (level: 'violation') as errors
 * - Recommendations (level: 'recommendation') as warnings
 * - Success count as total headings minus errors and warnings
 *
 * @return {Object} Object containing success, error, and warning counts
 */
export const useHeadingStats = () => {
	const { sortedViolations } = useScannerWizardContext();

	const headingStats = useMemo(() => {
		const pageHeadings = getPageHeadings();

		// Get total number of headings on the page
		const totalHeadings = countAllHeadings(pageHeadings);

		// Get heading-related violations from the headingStructure category
		const headingViolations = sortedViolations.headingStructure || [];

		// Count errors (violation level) and warnings (recommendation level)
		const errors = headingViolations.filter(
			(violation) => violation.level === 'violation',
		).length;

		const warnings = headingViolations.filter(
			(violation) => violation.level === 'recommendation',
		).length;

		// Calculate success count: total headings - errors - warnings
		const success = Math.max(0, totalHeadings - errors - warnings);

		return {
			success,
			error: errors,
			warning: warnings,
			total: totalHeadings,
		};
	}, [sortedViolations]);

	return headingStats;
};

/**
 * Helper function to count all headings including nested ones
 *
 * @param {Array} headings - Array of heading objects from getPageHeadings()
 * @return {number} Total count of all headings
 */
const countAllHeadings = (headings) => {
	return headings.reduce((count, heading) => {
		return count + 1 + countAllHeadings(heading.children);
	}, 0);
};
