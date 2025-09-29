export const getElementContext = (currentEl) => {
	const headingSelector = 'h1, h2, h3, h4, h5, h6';
	const context = {
		previousSiblings: [],
		parentElements: [],
		sectionHeadings: [],
	};

	// Find headings among previous sibling elements
	let sibling = currentEl.previousElementSibling;
	while (sibling) {
		if (sibling.matches(headingSelector)) {
			context.previousSiblings.push({
				outerHTML: sibling.outerHTML,
				outerText: sibling.outerText,
			});
		}
		sibling = sibling.previousElementSibling;
	}

	// Traverse up the DOM tree to find headings in ancestor elements
	let ancestor = currentEl;
	while (ancestor) {
		// Check if this ancestor element itself is a heading
		if (ancestor.matches(headingSelector)) {
			context.parentElements.push({
				outerHTML: ancestor.outerHTML,
				outerText: ancestor.outerText,
			});
		}

		// Find section headers that are direct children of this ancestor
		const scopedHeadingSelector = headingSelector
			.split(',')
			.map((sel) => `:scope > ${sel.trim()}`)
			.join(', ');
		const sectionHeaders = ancestor.querySelectorAll(scopedHeadingSelector);

		sectionHeaders?.forEach((sectionHeader) => {
			if (sectionHeader) {
				context.sectionHeadings.push({
					outerHTML: sectionHeader.outerHTML,
					outerText: sectionHeader.outerText,
				});
			}
		});

		ancestor = ancestor.parentElement;
	}

	return context;
};
