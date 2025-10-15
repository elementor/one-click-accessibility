import { getElementByXPath } from '@ea11y-apps/scanner/utils/get-element-by-xpath';

export const getSnippetByXpath = (xpath) => {
	const element = getElementByXPath(xpath);
	if (!element || element.nodeType !== Node.ELEMENT_NODE) {
		return '';
	}

	const tag = element.tagName.toLowerCase();

	// Collect all attributes
	const attrs = Array.from(element.attributes)
		.map((attr) => `${attr.name}="${attr.value}"`)
		.join(' ');

	// Return only the opening tag (e.g. <nav class="main-nav">)
	return attrs ? `<${tag} ${attrs}>` : `<${tag}>`;
};
