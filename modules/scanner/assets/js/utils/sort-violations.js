import {
	INITIAL_SORTED_VIOLATIONS,
	VIOLATION_TYPES,
} from '@ea11y-apps/scanner/constants';

export const sortViolations = (violations) => {
	const sorted = structuredClone(INITIAL_SORTED_VIOLATIONS);

	violations.forEach((item) => {
		let type = '';
		const outer = item.node.outerHTML;
		item.snippet = outer.slice(0, outer.indexOf('>') + 1);

		Object.keys(VIOLATION_TYPES).forEach((key) => {
			if (VIOLATION_TYPES[key].includes(item.ruleId)) {
				type = key;
			}
		});
		sorted[type || 'other'].push(item);
	});

	return sorted;
};

export const sortRemediation = (remediations) => {
	const sorted = structuredClone(INITIAL_SORTED_VIOLATIONS);
	remediations.forEach((remediation) => {
		sorted[remediation.group].push(remediation);
	});
	return sorted;
};
