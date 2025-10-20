import {
	BACKGROUND_ELEMENT_CLASS,
	COLOR_ELEMENT_CLASS,
	CURRENT_ELEMENT_CLASS,
} from '@ea11y-apps/scanner/constants';
import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';

/**
 * Return outer html for el. Should be used only for global remediation.
 * @param {string|null} xpath
 * @param {string|null} attr
 * @return {string} element outer html with removed classes
 */
export const getOuterHtmlByXpath = (xpath, attr = null) => {
	if (!xpath) {
		return '';
	}
	const element = getElementByXPath(xpath);
	if (!element || element.nodeType !== Node.ELEMENT_NODE) {
		return '';
	}

	// Define ignored class constants (with dots)
	const ignoredClasses = new Set([
		CURRENT_ELEMENT_CLASS,
		COLOR_ELEMENT_CLASS,
		BACKGROUND_ELEMENT_CLASS,
	]);

	// Clone the node so we don’t modify the real DOM
	const clone = element.cloneNode(true);
	let html = clone.outerHTML;

	ignoredClasses.forEach((item) => {
		html = html.replaceAll(` ${item}`, '');
		html = html.replaceAll(item, '');
		html = html.replaceAll('class=""', '');
		if (attr) {
			html = html.replaceAll(attr, '');
		}
	});

	return html;
};
