const createHeadingObject = (element) => ({
	level: getHeadingLevel(element),
	content: element.textContent.trim(),
	element,
	children: [],
});

const getHeadingLevel = (element) => {
	if ('H' === element.tagName[0] && 2 === element.tagName.length) {
		return parseInt(element.tagName[1], 10);
	}

	const ariaLevel = element.getAttribute('aria-level');

	return parseInt(ariaLevel, 10) ?? 1;
};

const headings = Array.from(
	document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]'),
);

export const getPageHeadings = () => {
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
