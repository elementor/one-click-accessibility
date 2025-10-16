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

	run() {
		const { xpath, find, replace, global: isGlobal } = this.data;
		const el =
			isGlobal === '1'
				? this.getElementByXPathFallbackSnippet(find, xpath)
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
