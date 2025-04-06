import {
	INITIAL_SORTED_VIOLATIONS,
	VIOLATION_TYPES,
} from '@ea11y-apps/scanner/utils/constants';

export const sortViolations = (violations) => {
	const sorted = structuredClone(INITIAL_SORTED_VIOLATIONS);

	violations.forEach((item) => {
		let type = '';
		Object.keys(VIOLATION_TYPES).forEach((key) => {
			if (VIOLATION_TYPES[key].includes(item.ruleId)) {
				type = key;
			}
		});
		sorted[type || 'other'].push(item);
	});

	return sorted;
};
