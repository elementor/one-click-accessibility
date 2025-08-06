import {
	BACKGROUND_ELEMENT_CLASS,
	COLOR_ELEMENT_CLASS,
	CURRENT_ELEMENT_CLASS,
} from '@ea11y-apps/scanner/constants';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';

export const getElementCSSSelector = (xpath) => {
	let el = getElementByXPath(xpath);
	if (!(el instanceof Element)) {
		return null;
	}

	const ignoredClasses = new Set([
		CURRENT_ELEMENT_CLASS,
		COLOR_ELEMENT_CLASS,
		BACKGROUND_ELEMENT_CLASS,
	]);

	const parts = [];

	while (el && el.nodeType === Node.ELEMENT_NODE) {
		let selector = el.tagName.toLowerCase();

		if (el.id) {
			selector += `#${el.id}`;
			parts.unshift(selector);
			break; // Stop at ID
		}

		// Add classes unless it's <body> or ignored
		if (el.className && el.tagName.toLowerCase() !== 'body') {
			const classList = el.className
				.trim()
				.split(/\s+/)
				.filter((cls) => cls && !ignoredClasses.has(cls));
			if (classList.length) {
				selector += '.' + classList.join('.');
			}
		}

		// Add :nth-of-type if needed
		const parent = el.parentNode;
		if (
			parent &&
			!(
				parent.tagName?.toLowerCase() === 'body' &&
				el.tagName?.toLowerCase() === 'div'
			)
		) {
			const siblings = Array.from(parent.children).filter(
				(sibling) => sibling.tagName === el.tagName,
			);
			if (siblings.length > 1) {
				const index = siblings.indexOf(el) + 1;
				selector += `:nth-of-type(${index})`;
			}
		}

		parts.unshift(selector);
		el = el.parentElement;
	}

	return parts.join(' > ');
};
