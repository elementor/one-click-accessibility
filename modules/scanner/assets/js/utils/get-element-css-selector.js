import {
	BACKGROUND_ELEMENT_CLASS,
	COLOR_ELEMENT_CLASS,
	CURRENT_ELEMENT_CLASS,
} from '@ea11y-apps/scanner/constants';

export const getElementCSSSelector = (element) => {
	if (!element || !(element instanceof Element)) {
		return null;
	}

	const ignoredClasses = new Set([
		CURRENT_ELEMENT_CLASS,
		COLOR_ELEMENT_CLASS,
		BACKGROUND_ELEMENT_CLASS,
	]);

	const parts = [];

	while (element && element.nodeType === Node.ELEMENT_NODE) {
		let selector = element.tagName.toLowerCase();

		if (element.id) {
			selector += `#${element.id}`;
			parts.unshift(selector);
			break; // Stop at ID
		}

		// Add classes unless it's <body> or ignored
		if (element.className && element.tagName.toLowerCase() !== 'body') {
			const classList = element.className
				.trim()
				.split(/\s+/)
				.filter((cls) => cls && !ignoredClasses.has(cls));
			if (classList.length) {
				selector += '.' + classList.join('.');
			}
		}

		// Add :nth-of-type if needed
		const parent = element.parentNode;
		if (
			parent &&
			!(
				parent.tagName?.toLowerCase() === 'body' &&
				element.tagName?.toLowerCase() === 'div'
			)
		) {
			const siblings = Array.from(parent.children).filter(
				(sibling) => sibling.tagName === element.tagName,
			);
			if (siblings.length > 1) {
				const index = siblings.indexOf(element) + 1;
				selector += `:nth-of-type(${index})`;
			}
		}

		parts.unshift(selector);
		element = element.parentElement;
	}

	return parts.join(' > ');
};
