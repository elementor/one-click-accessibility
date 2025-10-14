import { RemediationBase } from './base';

export class ReplaceRemediation extends RemediationBase {
	replaceIgnoreCase(outerHtml, find, replace, lowerOuterHTML, lowerFind) {
		const index = lowerOuterHTML.indexOf(lowerFind);
		if (index === -1) {
			return outerHtml;
		}
		return (
			outerHtml.substring(0, index) +
			replace +
			outerHtml.substring(index + find.length)
		);
	}

	getElementBySnippet(snippet) {
		const temp = document.createElement('div');
		temp.innerHTML = snippet.trim();
		const parsed = temp.firstElementChild;
		if (!parsed) {
			return null;
		}

		const selectorParts = [parsed.tagName.toLowerCase()];

		// Add id and class if present
		if (parsed.id) {
			selectorParts.push(`#${parsed.id}`);
		}
		if (parsed.classList.length) {
			selectorParts.push(`.${Array.from(parsed.classList).join('.')}`);
		}

		const selector = selectorParts.join('');

		// Try to find it in the document
		return document.querySelector(selector);
	}

	run() {
		const { xpath, find, replace, global } = this.data;
		const el =
			global === '1'
				? this.getElementBySnippet(find)
				: this.getElementByXPath(xpath);

		if (!el) {
			return false;
		}
		const outerHTML = el.outerHTML;
		if (typeof find !== 'string' || typeof replace !== 'string') {
			return false;
		}
		const lowerOuterHTML = outerHTML.toLowerCase();
		const lowerFind = find.toLowerCase();
		if (!lowerOuterHTML.includes(lowerFind)) {
			return false;
		}

		const updatedHTML = this.replaceIgnoreCase(
			outerHTML,
			find,
			replace,
			lowerOuterHTML,
			lowerFind,
		);

		if (updatedHTML === outerHTML) {
			return false;
		}

		// Create a temporary container to parse the HTML string
		const tmp = document.createElement('div');
		tmp.innerHTML = updatedHTML;
		const newNode = tmp.firstElementChild;
		if (newNode && el.parentNode) {
			el.parentNode.replaceChild(newNode, el);
		}
		return true;
	}
}
