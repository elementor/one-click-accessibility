import {
	getHeadingXpath,
	toFlatTree,
} from '@ea11y-apps/scanner/utils/page-headings';
import { EA11Y_RULES } from '../rules';
import { HEADING_STATUS } from '../types/heading';

/**
 * Validates the heading tree and mutates it to show notices in the UI.
 *
 * @param {import('../types/heading').Ea11yHeading[]} headingTree
 * @param {string[]}                                  dismissedHeadingIssues
 * @return {import('../types/heading').Ea11yHeading[]} Validated heading tree.
 */
export const validateHeadings = (headingTree, dismissedHeadingIssues) => {
	if (!headingTree.length) {
		return headingTree;
	}

	const clone = [...headingTree];
	const flatHeadings = toFlatTree(clone).filter(
		(heading) =>
			!['none', 'presentation'].includes(heading.node.getAttribute('role')),
	);
	const h1Titles = flatHeadings.filter((heading) => 1 === heading.level);

	if (h1Titles.length > 1) {
		h1Titles.forEach((heading) => {
			heading.status = HEADING_STATUS.ERROR;
			heading.violationCode = EA11Y_RULES.REDUNDANT_H1_TAGS;
		});
	}

	if (!h1Titles.length) {
		clone[0].status = HEADING_STATUS.ERROR;
		clone[0].violationCode = EA11Y_RULES.MISSING_H1_TAG;
	}

	validateHierarchy(clone, dismissedHeadingIssues);

	return clone;
};

/**
 * @param {import('../types/heading').Ea11yHeading[]} headings
 * @param {string[]}                                  dismissedHeadingIssues
 * @param {number}                                    parentLevel
 */
const validateHierarchy = (
	headings,
	dismissedHeadingIssues = [],
	parentLevel = 0,
) => {
	let previousLevel = parentLevel;

	headings.forEach((heading) => {
		const currentLevel = heading.level;

		if (previousLevel > 0 && currentLevel > previousLevel + 1) {
			const xpath = getHeadingXpath(heading.node);

			if (
				// Important to not overwrite HEADING_STATUS.ERROR
				heading.status === HEADING_STATUS.SUCCESS &&
				!dismissedHeadingIssues.includes(xpath)
			) {
				heading.status = HEADING_STATUS.WARNING;
				heading.violationCode = EA11Y_RULES.INCORRECT_HEADING_HIERARCHY;
			}
		}

		previousLevel = currentLevel;

		if (heading.children && heading.children.length > 0) {
			validateHierarchy(heading.children, dismissedHeadingIssues, currentLevel);
		}
	});
};

/**
 * Returns heading validation stats.
 *
 * @param {import('../types/heading').Ea11yHeading[]} headings Validated heading tree.
 * @return {import('../types/heading').Ea11yHeadingStats} Validation stats.
 */
export const calculateStats = (headings) => {
	const flatHeadings = toFlatTree(headings);
	const output = {
		total: flatHeadings.length,
		[HEADING_STATUS.SUCCESS]: 0,
		[HEADING_STATUS.WARNING]: 0,
		[HEADING_STATUS.ERROR]: 0,
	};

	flatHeadings.forEach((heading) => {
		const status = heading.status;

		output[status]++;
	});

	return output;
};
