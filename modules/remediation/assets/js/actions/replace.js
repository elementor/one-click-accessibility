import { RemediationBase } from './base';

export class ReplaceRemediation extends RemediationBase {
	run() {
		const { xpath, find, replace } = this.data;
		const el = this.getElementByXPath(xpath);
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

		const regex = new RegExp(find, 'i'); // 'i' = ignore case
		const updatedHTML = outerHTML.replace(regex, replace);

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
