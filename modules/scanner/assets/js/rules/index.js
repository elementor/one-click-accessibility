/**
 * Custom Rules Registry
 *
 * This file manages all custom accessibility rules that extend the ACE engine.
 * Add new rules to the registry to automatically include them in scans.
 */

import headingHierarchyCheck from './heading-hierarchy-check';
import missingH1Check from './missing-h1-check';
import singleH1Check from './single-h1-check';

/**
 * Registry of all custom accessibility rules
 *
 * To add a new rule:
 * 1. Import the rule at the top of this file
 * 2. Add it to the rules array below
 * 3. The rule will automatically be included in scans
 */
export const customRules = [
	singleH1Check,
	missingH1Check,
	headingHierarchyCheck,
];

/**
 * Run all registered custom rules against the document
 *
 * @param {Document} document - The document to scan
 * @return {Array} Array of rule results (violations, recommendations, passes)
 */
export const runAllCustomRules = (document) => {
	const results = [];

	const context = {
		dom: {
			node: document,
		},
	};

	customRules.forEach((rule) => {
		try {
			const result = rule.run(context);

			if (result) {
				// Add the first relevant element as node reference for focusing
				if (result.level === 'violation' || result.level === 'recommendation') {
					const selector = getElementSelector(rule.id);
					if (selector) {
						const elements = document.querySelectorAll(selector);
						if (elements.length > 0) {
							result.node = elements[0];
						}
					}
				}

				results.push(result);
			}
		} catch (error) {
			console.warn(`Error running custom rule ${rule.id}:`, error);
		}
	});

	return results;
};

/**
 * Get appropriate element selector for a rule to enable focusing
 *
 * @param {string} ruleId - The rule ID
 * @return {string|null} CSS selector or null if no specific selector needed
 */
function getElementSelector(ruleId) {
	const selectorMap = {
		single_h1_check: 'h1',
		missing_h1_check: 'body', // Focus on body since no h1 exists
		heading_hierarchy_check: 'h1, h2, h3, h4, h5, h6',
	};

	return selectorMap[ruleId] || null;
}

/**
 * Get all rule IDs for categorization
 *
 * @return {Array<string>} Array of rule IDs
 */
export const getCustomRuleIds = () => {
	return customRules.map((rule) => rule.id);
};

export default {
	customRules,
	runAllCustomRules,
	getCustomRuleIds,
};
