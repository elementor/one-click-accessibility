import headingHierarchyCheck from './heading-hierarchy-check';
import missingH1Check from './missing-h1-check';
import singleH1Check from './single-h1-check';

export const EA11Y_RULES = Object.freeze({
	MISSING_H1_TAG: 'missing_h1_check',
	REDUNDANT_H1_TAGS: 'single_h1_check',
	INCORRECT_HEADING_HIERARCHY: 'heading_hierarchy_check',
});

export const ea11yRuleSet = Object.freeze([
	singleH1Check,
	missingH1Check,
	headingHierarchyCheck,
]);

/**
 * Run all registered custom rules against the document.
 *
 * @param {Document} document - The document to scan
 * @return {Array} Array of rule results (violations, recommendations, passes)
 */
export const runAllEa11yRules = (document) => {
	const results = [];

	const context = {
		dom: {
			node: document,
		},
	};

	Object.values(ea11yRuleSet).forEach((rule) => {
		try {
			const result = rule.run(context);

			if (result) {
				results.push(result);
			}
		} catch (error) {
			console.error(`Error running custom rule ${rule.id}:`, error);
		}
	});

	return results;
};
