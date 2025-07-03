import { RemediationBase } from './base';

export class ElementRemediation extends RemediationBase {
	run() {
		const { xpath, action, content, child } = this.data;
		const el = this.getElementByXPath(xpath);
		if (!el) {
			return false;
		}
		let childEl = null;
		if (child) {
			try {
				childEl = this.createElement(
					child.tag,
					child.attributes || [],
					child.content || '',
				);
			} catch (e) {
				return;
			}
		}
		switch (action) {
			case 'update':
				el.nodeValue = content;
				break;
			case 'remove':
				if (el.parentNode) {
					el.parentNode.removeChild(el);
				}
				break;
			case 'add_child':
				if (childEl) {
					el.appendChild(childEl);
				}
				break;
			case 'remove_child':
				if (childEl) {
					el.removeChild(childEl);
				}
				break;
			case 'add_before':
				if (childEl && el.parentNode) {
					el.parentNode.insertBefore(childEl, el);
				}
				break;
			case 'add_after':
				if (childEl && el.parentNode) {
					el.parentNode.insertBefore(childEl, el.nextSibling);
				}
				break;
		}

		return true;
	}
}
