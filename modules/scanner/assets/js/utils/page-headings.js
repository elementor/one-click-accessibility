import getXPath from 'get-xpath';
import { HEADING_STATUS } from '../types/heading';

/**
 * Convert DOM node to a simplified structure.
 *
 * @param {HTMLHeadingElement} node DOM node.
 * @return {import('../types/heading').Ea11yHeading} Heading object.
 */
const createHeadingObject = (node) => ({
	level: getHeadingLevel(node),
	content: node.textContent.trim(),
	node,
	children: [],
	status: HEADING_STATUS.SUCCESS,
	violationCode: null,
});

/**
 * Retrieves heading level based on the Hx number or aria-level attribute.
 *
 * @param {HTMLElement} element DOM node.
 * @return {number | null} Heading level if it can be parsed, null otherwise.
 */
export const getHeadingLevel = (element) => {
	const ariaLevel = element.getAttribute('aria-level');

	if (ariaLevel) {
		return parseInt(ariaLevel, 10);
	}

	if (
		'H' === element.tagName[0] &&
		2 === element.tagName.length &&
		element.tagName[1] <= 6
	) {
		return parseInt(element.tagName[1], 10);
	}

	return null;
};

/**
 * Builds an n-nary tree of page headings.
 *
 * @return {import('../types/heading').Ea11yHeading[]} Headings tree.
 */
export const getPageHeadings = () => {
	const headings = Array.from(
		document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]'),
	);

	const root = [];
	const stack = [];

	headings.forEach((headingHTMLElement) => {
		const heading = createHeadingObject(headingHTMLElement);
		const level = heading.level;

		// Pop stack until we find the correct parent level
		while (stack.length > 0 && stack[stack.length - 1].level >= level) {
			stack.pop();
		}

		if (stack.length === 0) {
			root.push(heading);
		} else {
			stack[stack.length - 1].node.children.push(heading);
		}

		// Push the current heading onto the stack
		stack.push({ node: heading, level });
	});

	return root;
};

/**
 * Converts an n-nary tree to a flat tree.
 *
 * @param {import('../types/heading').Ea11yHeading[]} headings N-nary tree [a->b->c, d].
 * @return {import('../types/heading').Ea11yHeading[]} Headings flat tree [a, b, c, d].
 */
export const toFlatTree = (headings) => {
	const output = [];

	const walk = (h) => {
		h.forEach((heading) => {
			output.push(heading);

			if (heading.children && heading.children.length > 0) {
				walk(heading.children);
			}
		});
	};

	walk(headings);

	return output;
};

/**
 * Returns the XPath of the element.
 *
 * @param {HTMLElement} node DOM node.
 * @return {string} Heading XPath.
 */
export const getHeadingXpath = (node) => {
	return getXPath(node, { ignoreId: true });
};
