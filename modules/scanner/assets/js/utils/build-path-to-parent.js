import getXPath from 'get-xpath';

/**
 * Builds an array of elements from a child up to a specific parent node.
 * @param {Element} itemNode   - Starting (child) element.
 * @param {Element} parentNode - Ancestor element to stop at.
 * @return {string[]} Array of elements from item → parent (inclusive)
 */
export const buildPathToParent = (itemNode, parentNode) => {
	const path = [];

	if (!parentNode) {
		return [getXPath(itemNode, { ignoreId: true })];
	}

	let current = itemNode;
	while (current) {
		path.push(getXPath(current, { ignoreId: true }));
		if (current === parentNode) {
			break;
		}
		current = current.parentElement;
	}

	return path;
};
