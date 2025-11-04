import getXPath from 'get-xpath';
import {
	getDataFromCss,
	isValidCSS,
} from '@ea11y-apps/global/utils/color-contrast-helpers';
import { RemediationBase } from './base';

export class StylesRemediation extends RemediationBase {
	constructor(dom, data) {
		super(dom, data);

		this.maybeAddStyleTag();
	}

	maybeAddStyleTag() {
		let node = this.dom.querySelector('style#ea11y-remediation-styles');

		if (!node) {
			node = this.dom.createElement('style');
			node.id = 'ea11y-remediation-styles';

			this.dom.body.appendChild(node);
		}
	}

	getStyleTag() {
		return this.dom.querySelector('style#ea11y-remediation-styles');
	}

	getElementCSSSelector(xpath) {
		let element = this.getElementByXPath(xpath);
		if (!element || !(element instanceof Element)) {
			return null;
		}

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
				const classList = element.className.trim().split(/\s+/);
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
	}

	getCssRulesForContrast(
		colorXPath = null,
		color = null,
		backgroundXPath = null,
		background = null,
	) {
		try {
			const colorSelector = colorXPath
				? this.getElementCSSSelector(colorXPath)
				: null;
			const bgSelector = backgroundXPath
				? this.getElementCSSSelector(backgroundXPath)
				: null;

			const colorRule =
				colorSelector && color
					? `${colorSelector} {color: ${color} !important;}`
					: '';

			const bgRule =
				bgSelector && background
					? `${bgSelector} {background-color: ${background} !important;}`
					: '';

			const css = `${colorRule}${bgRule}`;
			return isValidCSS(css) ? css : '';
		} catch (e) {
			console.warn('Failed to convert XPath to CSS selector', e);
			return '';
		}
	}

	// It should only work at the global level if the elements were not found on the backend side.
	run() {
		const tag = this.getStyleTag();

		if (!tag) {
			return false;
		}

		let rule = this.data.rule;

		if (this.data.global === '1') {
			const cssData = getDataFromCss(this.data.rule);
			const colorElement = getXPath(
				this.getElementByXPathFallbackSnippet(this.data.xpath, this.data.find),
			);
			const bgElement = getXPath(
				this.getElementByXPathFallbackSnippet(
					this.data.parentXPath,
					this.data.parentFind,
				),
			);

			rule = this.getCssRulesForContrast(
				colorElement,
				cssData.color.value,
				bgElement,
				cssData.background.value,
			);
		}

		if (isValidCSS(this.data.rule)) {
			tag.innerText += rule;
		}
		return true;
	}
}
